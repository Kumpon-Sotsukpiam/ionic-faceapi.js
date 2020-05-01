import { Component, HostListener } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ScreensizeService } from './services/screensize.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private isDesktop: boolean
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screensizeService: ScreensizeService
  ) {
    this.initializeApp();
    this.screensizeService.isDesktopView().subscribe(isDesktop => {
      this.isDesktop = isDesktop
      console.log(this.isDesktop);
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.screensizeService.onResize(this.platform.width(), this.platform.height());
    });
  }
  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    console.log("Width: "+event.target.innerWidth)
    console.log("Height: "+event.target.innerHeight)
    this.screensizeService.onResize(event.target.innerWidth, event.target.innerHeight);
  }
}
