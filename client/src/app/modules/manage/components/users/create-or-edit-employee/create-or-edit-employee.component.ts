import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { Bank, Level, Status } from 'src/app/enums/Enum';
import { LoginResponse, Position } from 'src/app/interfaces/interfaceReponse';
import { Department, Employee } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { PositionService } from 'src/app/services/position.service';
import { RoleService } from 'src/app/services/role.service';

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
  positionList = new Observable<Position[]>();
  bankList = new Observable<Bank[]>();
  roleList = new Observable<any[]>();
  departmentList = new Observable<Department[]>();
  isVisiblePositionModal: boolean = false;
  isVisibleDepartmentModal: boolean = false;
  isEdit: boolean = false;
  roles: any;
  user: LoginResponse= JSON.parse(localStorage.getItem('user')!);
  roleSelect: string[] = [];
  employeeList: any[] = [];
  role = JSON.parse(localStorage.getItem('role')!);
  loading: boolean = false;

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private dataService: DataService,
    private positionService: PositionService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private roleService: RoleService,
  ) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.employeeForm.reset();
    this.roleSelect = [];
    this.loading = false;
    this.isEdit = true;
    if (this.mode == 'create') {
      this.title = 'Create';
      this.employeeForm.enable();
      this.employeeForm.controls['level'].setValue(Level.Intern);
      this.employeeForm.controls['positionId'].setValue(this.positionService.positionList$.value[0]?.id);
      this.employeeForm.controls['departmentId'].setValue(this.departmentService.departmentList$.value[0]?.id);
      this.employeeForm.controls['manager'].setValue(this.employeeList[0]?.id);
      this.employeeForm.controls['gender'].setValue(true);
      this.roleSelect.push(this.roleService.roleList$.value.find(i => i.name == 'Employee')?.id);
    } else {
      this.employeeForm.patchValue(this.data!);
      this.employeeForm.value.roles.forEach((i: any) => {
        this.roleSelect.push(i.id);
      });
      this.changeMode();
    }
  }

  ngOnInit(): void {
    this.roleService.getAllRole();
    this.departmentList = this.departmentService.departmentList$;
    this.levelList = this.dataService.levelList;
    this.positionList = this.positionService.positionList$;
    this.bankList = this.dataService.bankList;
    this.roleList = this.roleService.roleList$;
    this.employeeService.getManager().subscribe((res) => {
      this.employeeList = res.data;
    });
  }

  initForm() {
    this.employeeForm = this.fb.group({
      id: [null],
      fullName: [null, Validators.required],
      roles: [this.fb.array([{
        id: [null],
        name: [null]
      }]), Validators.required],
      gender: [true, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      phone: [null, Validators.required],
      doB: [null, Validators.required],
      level: [Level.Intern, Validators.required],
      positionId: [1, Validators.required],
      departmentId: [null],
      manager: [null],
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
    this.loading = true;
    if (mode == 'edit') {
      if (this.employeeForm.value.role == null) {
        this.employeeForm.controls['roles'].setValue(this.roleSelect);
      }
      if (this.employeeForm.valid) {
        this.employeeService.saveEmployee(this.employeeForm.value)
          .subscribe((response) => {
            if (response.statusCode == 200) {
              this.notification.success('Successfully!', `Create ${Level[response.data.level]} ${response.data.fullName}`);
              if (this.employeeForm.value.id) {
                this.employeeService.employeeList$.value.splice(this.employeeService.employeeList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
                this.employeeService.employeeList$.next([...this.employeeService.employeeList$.value]);
              } else {
                this.employeeService.employeeList$.next([response.data, ...this.employeeService.employeeList$.value]);
              };
              this.loading = false;
              this.close();
            };
          });
      } else {
        Object.values(this.employeeForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    } else {
      const payload = {
        id: this.data?.id!,
        pmId: this.user.id,
        status: mode == 'reject' ? Status.Rejected : Status.Approved,
      }
      this.employeeService
        .updateStatusUserInfo(payload)
        .subscribe((response) => {
          if (response.statusCode == 200) {
            this.notification.success('Successfully', '');
            const index = this.employeeService.requestChangeInfoList$.value.findIndex((item) => item.id == payload.id);
            this.employeeService.requestChangeInfoList$.value.splice(index, 1);
            this.employeeService.requestChangeInfoList$.next([...this.employeeService.requestChangeInfoList$.value]);
            this.employeeService.getAllEmployee();
            this.loading = false;
            this.close();
          }
        });
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
    this.employeeForm.controls['gender'].setValue(true);
  }

  checkRole(role: any) {
    const adminId = this.roleService.roleList$.value.find(i => i.name == "Admin")?.id;
    const empId = this.roleService.roleList$.value.find(i => i.name == "Employee")?.id;
    if (role?.includes(adminId)) {
      this.roleSelect = [];
      this.roleList.subscribe((item) => { item.forEach((i => this.roleSelect.push(i.id)))});
    } else {
      if (this.roleSelect.includes(adminId)) {
        this.roleSelect = [];
        this.roleSelect.push(empId);
      }
    }
  }
}
