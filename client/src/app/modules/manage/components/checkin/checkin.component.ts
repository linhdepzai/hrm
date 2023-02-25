import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit, OnDestroy {
  public isCameraExist = true;
  public showWebcam = true;
  public webcamImage!: WebcamImage;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  public checkinList: any[] = [];
  private confirmModal?: NzModalRef;
  
  constructor(
    private modal: NzModalService,
    private datepipe: DatePipe,
    private notification: NzNotificationService
    ) {}

  ngOnInit(): void{
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.isCameraExist = mediaDevices && mediaDevices.length > 0;
      }
    )
  }

  handleImage(webcamImage: WebcamImage){
    this.webcamImage = webcamImage;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean|string>{
    return this.nextWebcam.asObservable();
  }

  showConfirm(): void {
    this.trigger.next();
    const now = this.datepipe.transform(new Date(), 'HH:mm');
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Check in at ' + now + ' ?',
      nzContent: '<img src="' + this.webcamImage.imageAsDataUrl + '" alt="Image Checkin" width="500px">',
      nzWidth: '640px',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.notification.success('Checkin success!!!', 'You checkin at ' + now);
          this.checkinList.push({photoCheckin: this.webcamImage.imageAsDataUrl});
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }

  ngOnDestroy(): void {
    this.showWebcam = false;
  }
}
