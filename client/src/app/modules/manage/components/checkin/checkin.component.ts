import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { LoginResponse, TimeKeepingResponse } from 'src/app/interfaces/interfaceReponse';
import { ManageService } from '../../services/manage.service';

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
    private modal: NzModalService,
    private datepipe: DatePipe,
    private manageServie: ManageService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.manageServie.myTimeKeepingList$.subscribe((data) => {
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
      id: [null],
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
    if (check && check.photoCheckout != '') {
      this.checkinForm.controls['id'].setValue(check.id);
    };
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
          this.manageServie.checkinOrCheckout(this.checkinForm.value);
          this.checkTimeKeepingToday();
          setTimeout(resolve, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }

  ngOnDestroy(): void {
    this.showWebcam = false;
  }
}
