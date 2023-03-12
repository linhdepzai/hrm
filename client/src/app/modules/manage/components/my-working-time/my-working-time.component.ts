import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Status } from 'src/app/enums/Enum';
import { LoginResponse, TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { ManageService } from '../../services/manage.service';

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
    private manageService: ManageService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.initForm();
    this.checkEdit();
    this.manageService.timeWorkingList$.subscribe((data) => {
      this.timeWorkingList = data.filter((item) => item.employeeId == this.user.id);
      this.workingTimeForm.patchValue(this.timeWorkingList[0]);
      this.calcTotalTime();
    });
  }

  initForm() {
    this.workingTimeForm = this.fb.group({
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
    return (morningTotalHour + morningTotalMinute + afternoonTotalHour + afternoonTotalMinute).toFixed(2);
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

  }
}
