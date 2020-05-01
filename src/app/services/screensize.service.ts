import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ScreensizeService {
  private isDesktop = new BehaviorSubject<boolean>(false);
  public width: number
  public height: number
  constructor() { }

  onResize(width, height) {
    this.width = width
    this.height = height
    if (width < 568) {
      this.isDesktop.next(false);
    } else {
      this.isDesktop.next(true);
    }
  }
  isDesktopView(): Observable<boolean> {
    return this.isDesktop.asObservable().pipe(distinctUntilChanged());
  }
}
