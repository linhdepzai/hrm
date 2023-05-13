import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { LoginResponse, TimeKeepingResponse } from 'src/app/interfaces/interfaceReponse';
import { TimekeepingService } from 'src/app/services/timekeeping.service';

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
  checkinList: { photo: string, time: Date, checkin: boolean, punish: boolean }[] = [];
  confirmModal?: NzModalRef;
  checkinForm!: FormGroup;
  user!: LoginResponse;
  myTimeKeepingList: TimeKeepingResponse[] = [];
  btnText = 'Check In';
  modalTitle = '';
  disableBtn = false;
  visibleModalList = false;

  constructor(
    private timekeepingService: TimekeepingService,
    private modal: NzModalService,
    private datepipe: DatePipe,
    private fb: FormBuilder,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.timekeepingService.getTimeKeepingForUser(this.user.id, new Date().getMonth() + 1, new Date().getFullYear());
    this.timekeepingService.myTimeKeepingList$.subscribe((data) => {
      this.myTimeKeepingList = data;
      this.checkTimeKeepingToday();
      this.checkinList = [];
      data.forEach((item) => {
        if (item.photoCheckout != null) {
          this.checkinList = [...this.checkinList, { photo: item.photoCheckout, time: item.checkout, checkin: false, punish: item.punish }];
        };
        if (item.photoCheckin != null) {
          this.checkinList = [...this.checkinList, { photo: item.photoCheckin, time: item.checkin, checkin: true, punish: item.punish }];
        }
      });
    });
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.isCameraExist = mediaDevices && mediaDevices.length > 0;
      }
    );
    this.initForm();
    this.checkinForm.reset();
  }

  checkTimeKeepingToday() {
    const check = this.myTimeKeepingList.find(i =>
      this.datepipe.transform(i.checkin, 'dd/MM/YYYY')?.indexOf(this.datepipe.transform(new Date(), 'dd/MM/YYYY')!) != -1 ||
      this.datepipe.transform(i.checkout, 'dd/MM/YYYY')?.indexOf(this.datepipe.transform(new Date(), 'dd/MM/YYYY')!) != -1);
    if (check) {
      if (check?.photoCheckout == null) {
        this.btnText = 'Check Out';
        this.modalTitle = 'Check out at ';
      } else {
        this.disableBtn = true;
      };
    } else {
      this.btnText = 'Check In';
      this.modalTitle = 'Check in at ';
    };
  }

  initForm() {
    this.checkinForm = this.fb.group({
      employeeId: [this.user.id, Validators.required],
      checkin: [new Date()],
      photoCheckin: [''],
      checkout: [new Date()],
      photoCheckout: [''],
    });
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  openModal() {
    this.visibleModalList = true;
  }

  showConfirm(): void {
    this.trigger.next();
    const check = this.myTimeKeepingList.find(i => this.datepipe.transform(i.checkin, 'dd/MM/YYYY')?.indexOf(this.datepipe.transform(new Date(), 'dd/MM/YYYY')!) != -1);
    this.checkinForm.controls['employeeId'].setValue(this.user.id);
    this.checkinForm.controls['checkin'].setValue(new Date());
    this.checkinForm.controls['photoCheckin'].setValue(this.webcamImage.imageAsDataUrl);
    this.checkinForm.controls['checkout'].setValue(new Date());
    this.checkinForm.controls['photoCheckout'].setValue(this.webcamImage.imageAsDataUrl);
    const now = this.datepipe.transform(new Date(), 'HH:mm');
    this.confirmModal = this.modal.confirm({
      nzTitle: this.modalTitle + now + '?',
      nzContent: `<img src="${this.webcamImage.imageAsDataUrl}" alt="Image Checkin" width="500px">`,
      nzWidth: '640px',
      nzOnOk: () =>
        new Promise((resolve) => {
          this.timekeepingService.checkinOrCheckout(this.checkinForm.value)
          .subscribe((response) => {
            if (response.statusCode == 200) {
              if(response.data.photoCheckout == null) {
                response.data.checkin = new Date(new Date(response.data.checkin).getTime() - 7 * 60 * 60 * 1000);
                const timeCheckin = this.datepipe.transform(response.data.checkin, 'HH:mm');
                this.notification.success('Checkin success!!!', 'You checkin at ' + timeCheckin);
              } else {
                response.data.checkout = new Date(new Date(response.data.checkout).getTime() - 7 * 60 * 60 * 1000);
                const timeCheckout = this.datepipe.transform(response.data.checkout, 'HH:mm');
                this.notification.success('Checkout success!!!', 'You checkout at ' + timeCheckout);
              }
              this.timekeepingService.myTimeKeepingList$.value.splice(this.timekeepingService.myTimeKeepingList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
              this.timekeepingService.myTimeKeepingList$.next([...this.timekeepingService.myTimeKeepingList$.value]);
            }
            this.checkTimeKeepingToday();
          });
          setTimeout(resolve, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }

  ngOnDestroy(): void {
    this.showWebcam = false;
  }
}
