import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamUtil } from 'ngx-webcam';
import { WebcamInitError } from 'ngx-webcam/public_api';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
  isCameraExist = true;
  showWebcam = true;
  webcamImage!: WebcamImage;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  ngOnInit(): void{
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.isCameraExist = mediaDevices && mediaDevices.length > 0;
      }
    )
  }

  takeSnapshot() {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage){
    this.webcamImage = webcamImage;
    this.showWebcam = false;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean|string>{
    return this.nextWebcam.asObservable();
  }
}
