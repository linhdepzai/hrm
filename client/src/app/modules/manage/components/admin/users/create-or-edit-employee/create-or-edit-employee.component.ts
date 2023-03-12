import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Bank, Level, Position } from 'src/app/enums/Enum';
import { Department } from 'src/app/interfaces/interfaces';
import { ManageService } from 'src/app/modules/manage/services/manage.service';

@Component({
  selector: 'app-create-or-edit-employee',
  templateUrl: './create-or-edit-employee.component.html',
  styleUrls: ['./create-or-edit-employee.component.css']
})
export class CreateOrEditEmployeeComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  title: string = 'Create';
  employeeForm!: FormGroup;
  levelList = new Observable<{ value: Level; label: string }[]>();
  positionList = new Observable<{ value: Position; label: string }[]>();
  bankList = new Observable<Bank[]>();
  departmentList = new Observable<Department[]>();
  isVisibleModal: boolean = false;

  constructor(
    private manageService: ManageService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.departmentList = this.manageService.departmentList$;
    this.levelList = this.manageService.levelList;
    this.positionList = this.manageService.positionList;
    this.bankList = this.manageService.bankList;
  }

  initForm() {
    this.employeeForm = this.fb.group({
      id: [null],
      fullName: [null, Validators.required],
      sex: [true, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      phone: [null, Validators.required],
      doB: [null, Validators.required],
      level: [Level.Intern, Validators.required],
      position: [Position.Dev, Validators.required],
      departmentId: [null, Validators.required],
      startingDate: [null, Validators.required],
      bank: [null],
      bankAccount: [null],
      taxCode: [null],
      insuranceStatus: [null],
      identify: [null, Validators.required],
      placeOfOrigin: [null],
      placeOfResidence: [null],
      dateOfIssue: [null],
      issuedBy: [null],
    });
  }

  submitForm() {
    this.employeeForm.controls['startingDate'].setValue(this.datepipe.transform(new Date(), 'YYYY-MM-dd'));
    if (this.employeeForm.valid) {
      this.manageService.saveEmployee(this.employeeForm.value);
      this.close();
    } else {
      Object.values(this.employeeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  close(): void {
    this.resetForm();
    this.cancel.emit();
  }

  resetForm() {
    this.employeeForm.reset();
    this.employeeForm.controls['level'].setValue(Level.Intern);
    this.employeeForm.controls['position'].setValue(Position.Dev);
    this.employeeForm.controls['sex'].setValue(true);
  }
}
