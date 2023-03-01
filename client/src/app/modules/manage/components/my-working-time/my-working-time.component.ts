import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageService } from '../../services/manage.service';

@Component({
  selector: 'app-my-working-time',
  templateUrl: './my-working-time.component.html',
  styleUrls: ['./my-working-time.component.css']
})
export class MyWorkingTimeComponent implements OnInit {
  workingTimeForm!: FormGroup;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  data: any;
  isEdit: boolean = false;

  constructor(
    private manageService: ManageService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.workingTimeForm.patchValue(this.data);
    this.checkEdit();
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

  calcTotalTime(endTime: any, startTime: any) {
    const total = endTime.substring(0, 2) - startTime.substring(0, 2);
    const totalMinute = (endTime.substring(3, 5) - startTime.substring(3, 5)) / 60;
    return total + totalMinute;
  }

  checkEdit() {
    if (this.isEdit == false) {
      this.workingTimeForm.disable();
    } else {
      this.workingTimeForm.enable();
      this.workingTimeForm.controls['morningTotalTime'].disable();
      this.workingTimeForm.controls['afternoonTotalTime'].disable();
      this.workingTimeForm.controls['morningTotalTime'].setValue(this.calcTotalTime(this.workingTimeForm.value.morningStartTime, this.workingTimeForm.value.morningEndTime));
      this.workingTimeForm.controls['afternoonTotalTime'].setValue(this.calcTotalTime(this.workingTimeForm.value.afternoonStartTime, this.workingTimeForm.value.afternoonEndTime));
    }
  }

  changeMode() {
    this.isEdit = !this.isEdit;
    this.checkEdit();
  }

  submit() {

  }
}
