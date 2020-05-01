import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import * as faceapi from 'face-api.js'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  // getElementById
  @ViewChild("video", { static: true }) private video: ElementRef
  @ViewChild("canvas", { static: true }) private canvas: ElementRef
  // face-api.js
  private scoreThreshold: number
  private inputSize: number
  private faceapiOptions: faceapi.TinyFaceDetectorOptions
  // config width+heigth of video
  private displaySize: { width: number, height: number }
  // save captures Image
  private captures: Array<any>
  constructor() {
    this.displaySize = { width: 640, height: 480 }
    this.captures = []
  }
  ngOnInit() {
    this.scoreThreshold = 0.5
    this.inputSize = 224
    this.faceapiOptions = new faceapi.TinyFaceDetectorOptions({
      scoreThreshold: this.scoreThreshold,
      inputSize: this.inputSize
    })
  }
  ngAfterViewInit() {
    // laoding model
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("assets/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("assets/models"),
      faceapi.nets.ageGenderNet.loadFromUri('assets/models')
    ]).then(() => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
          this.video.nativeElement.srcObject = (stream) // set stream video
          this.video.nativeElement.play()// playing video
          setTimeout(() => this.onFaceAPI(), 1000) // start faceAPI function delay 1 sec.
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }
  onFaceAPI() {
    faceapi.matchDimensions(this.canvas.nativeElement, this.displaySize)
    setInterval(async () => {
      const detections = await faceapi.detectSingleFace(this.video.nativeElement, this.faceapiOptions)
        .withFaceLandmarks()
        .withAgeAndGender()
      console.log(detections);
      if (detections) {
        const resizeDetections = faceapi.resizeResults(detections, this.displaySize)
        const { age, gender, genderProbability } = resizeDetections
        this.canvas.nativeElement.getContext("2d").clearRect(0, 0, this.displaySize.width, this.displaySize.height)
        faceapi.draw.drawDetections(this.canvas.nativeElement, resizeDetections)
        faceapi.draw.drawFaceLandmarks(this.canvas.nativeElement, resizeDetections)
        new faceapi.draw.DrawTextField(
          [
            `${faceapi.utils.round(age, 0)} years`,
            `${gender} (${faceapi.utils.round(genderProbability)})`
          ],
          detections.detection.box.bottomLeft
        ).draw(this.canvas.nativeElement)
      }
    }, 100)
  }
}
