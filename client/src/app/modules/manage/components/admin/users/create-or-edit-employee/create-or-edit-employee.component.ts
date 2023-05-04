import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { Bank, Level, Position, Status } from 'src/app/enums/Enum';
import { Department, Employee } from 'src/app/interfaces/interfaces';
import { DepartmentService } from 'src/app/modules/manage/services/department.service';
import { EmployeeService } from 'src/app/modules/manage/services/employee.service';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-create-or-edit-employee',
  templateUrl: './create-or-edit-employee.component.html',
  styleUrls: ['./create-or-edit-employee.component.css']
})
export class CreateOrEditEmployeeComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() data: Employee | undefined;
  @Input() mode: string = 'create';
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  title: string = 'Create';
  employeeForm!: FormGroup;
  levelList = new Observable<{ value: Level; label: string }[]>();
  positionList = new Observable<{ value: Position; label: string }[]>();
  bankList = new Observable<Bank[]>();
  departmentList = new Observable<Department[]>();
  isVisibleModal: boolean = false;
  isEdit: boolean = false;

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private apiService: ApiService,
    private dataService: DataService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
  ) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.employeeForm.reset();
    this.isEdit = true;
    if (this.mode == 'create') {
      this.title = 'Create';
      this.employeeForm.enable();
    } else {
      this.employeeForm.patchValue(this.data!);
      this.changeMode();
    }
  }

  ngOnInit(): void {
    this.departmentList = this.departmentService.departmentList$;
    this.levelList = this.dataService.levelList;
    this.positionList = this.dataService.positionList;
    this.bankList = this.dataService.bankList;
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
      departmentId: [null],
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

  submitForm(mode: string) {
    if (mode == 'edit') {
      this.employeeForm.controls['startingDate'].setValue(this.datepipe.transform(new Date(), 'YYYY-MM-dd'));
      if (this.employeeForm.valid) {
        this.employeeService.saveEmployee(this.employeeForm.value);
        this.close();
      } else {
        Object.values(this.employeeForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    } else {
      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      const payload = {
        id: this.data?.id!,
        pmId: user.id,
        status: mode == 'reject' ? Status.Rejected : Status.Approved,
      }
      this.apiService
        .updateStatusUserInfo(payload)
        .subscribe((response) => {
          if (response.statusCode == 200) {
            this.notification.success('Successfully', '');
            const index = this.employeeService.requestChangeInfoList$.value.findIndex((item) => item.id == payload.id);
            this.employeeService.requestChangeInfoList$.value.splice(index, 1);
            this.employeeService.requestChangeInfoList$.next([...this.employeeService.requestChangeInfoList$.value]);
            this.employeeService.getAllEmployee();
            this.close();
          }
        })
    }
  }

  close(): void {
    this.resetForm();
    this.cancel.emit();
  }

  changeMode() {
    this.isEdit = !this.isEdit;
    this.title = (this.isEdit ? 'Update: ' : 'View: ') + this.data!.fullName;
    if (this.isEdit) {
      this.employeeForm.enable();
    } else {
      this.employeeForm.disable();
    }
  }

  resetForm() {
    this.employeeForm.reset();
    this.employeeForm.controls['level'].setValue(Level.Intern);
    this.employeeForm.controls['position'].setValue(Position.Dev);
    this.employeeForm.controls['sex'].setValue(true);
  }
}
