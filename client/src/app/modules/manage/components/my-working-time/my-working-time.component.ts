import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Status } from 'src/app/enums/Enum';
import { LoginResponse, TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AccountService } from '../../services/account.service';
import { TimeworkingService } from '../../services/timeworking.service';

@Component({
  selector: 'app-my-working-time',
  templateUrl: './my-working-time.component.html',
  styleUrls: ['./my-working-time.component.css']
})
export class MyWorkingTimeComponent implements OnInit {
  workingTimeForm!: FormGroup;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  isEdit: boolean = false;
  user!: LoginResponse;
  timeWorkingList: TimeWorkingResponse[] = [];
  status = Status;

  constructor(
    private accountService: AccountService,
    private timeworkingService: TimeworkingService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.accountService.getAllRequestChangeTimeWorkingForUser(this.user.id);
    this.initForm();
    this.checkEdit();
    this.accountService.requestTimeWorkingList$.subscribe((data) => {
      this.timeWorkingList = data;
      this.workingTimeForm.patchValue(data[0]);
      this.calcTotalTime();
    });
  }

  initForm() {
    this.workingTimeForm = this.fb.group({
      employeeId: [this.user.id, Validators.required],
      morningStartTime: [null, Validators.required],
      morningEndTime: [null, Validators.required],
      afternoonStartTime: [null, Validators.required],
      afternoonEndTime: [null, Validators.required],
      applyDate: [null, Validators.required],
      morningTotalTime: [0],
      afternoonTotalTime: [0],
    });
  }

  calcTotalTime() {
    const morningEndTime = this.datepipe.transform(this.workingTimeForm.value.morningEndTime, 'HH:mm') as any;
    const morningStartTime = this.datepipe.transform(this.workingTimeForm.value.morningStartTime, 'HH:mm') as any;
    const afternoonEndTime = this.datepipe.transform(this.workingTimeForm.value.afternoonEndTime, 'HH:mm')! as any;
    const afternoonStartTime = this.datepipe.transform(this.workingTimeForm.value.afternoonStartTime, 'HH:mm')! as any;
    const morningTotalHour = (morningEndTime == null ? '00:00' : morningEndTime).substring(0, 2) - (morningStartTime == null ? '00:00' : morningStartTime).substring(0, 2);
    const afternoonTotalHour = (afternoonEndTime == null ? '00:00' : afternoonEndTime).substring(0, 2) - (afternoonStartTime == null ? '00:00' : afternoonStartTime).substring(0, 2);
    const morningTotalMinute = ((morningEndTime == null ? '00:00' : morningEndTime).substring(3, 5) - (morningStartTime == null ? '00:00' : morningStartTime).substring(3, 5)) / 60;
    const afternoonTotalMinute = ((afternoonEndTime == null ? '00:00' : afternoonEndTime).substring(3, 5) - (afternoonStartTime == null ? '00:00' : afternoonStartTime).substring(3, 5).substring(3, 5)) / 60;
    this.workingTimeForm.controls['morningTotalTime'].setValue(morningTotalHour + morningTotalMinute);
    this.workingTimeForm.controls['afternoonTotalTime'].setValue(afternoonTotalHour + afternoonTotalMinute);
    const totalTime = morningTotalHour + morningTotalMinute + afternoonTotalHour + afternoonTotalMinute;
    return totalTime % 2 == 0 ? totalTime : totalTime.toFixed(2);
  }

  checkEdit() {
    if (this.isEdit == false) {
      this.workingTimeForm.patchValue(this.timeWorkingList[0]);
      this.workingTimeForm.disable();
    } else {
      this.workingTimeForm.enable();
      this.workingTimeForm.controls['morningTotalTime'].disable();
      this.workingTimeForm.controls['afternoonTotalTime'].disable();
      this.calcTotalTime();
    }
  }

  changeMode() {
    this.isEdit = !this.isEdit;
    this.checkEdit();
  }

  submit() {
    if (this.workingTimeForm.valid) {
      if ((this.calcTotalTime() as number) >= 8) {
        this.timeworkingService.requestChangeTimeWorking(this.workingTimeForm.value);
        this.changeMode();
      } else {
        this.notification.error('Error!!!', 'Working time must be greater than or equal to 8 hours!')
      }
    } else {
      Object.values(this.workingTimeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
