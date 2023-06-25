import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-create-department-modal',
  templateUrl: './create-department-modal.component.html',
  styleUrls: ['./create-department-modal.component.css']
})
export class CreateDepartmentModalComponent implements OnInit {
  @Input() isVisibleModal: boolean = false;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  departmentForm!: FormGroup;
  iconList: string[] = [];
  employeeList = new Observable<Employee[]>();

  constructor(
    private departmentService: DepartmentService,
    private dataService: DataService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.employeeService.getAllEmployee();
    this.employeeList = this.employeeService.employeeList$;
    this.dataService.iconList.subscribe((data) => { this.iconList = data });
  }

  initForm() {
    this.departmentForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      color: ['#00ff00'],
      icon: ['house'],
      boss: [null, Validators.required],
    });
  }

  submitForm() {
    if (this.departmentForm.valid) {
      this.departmentService.saveDepartment(this.departmentForm.value)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Successfully!', 'Department ' + response.data.name);
          if (this.departmentForm.value.id) {
            this.departmentService.departmentList$.value.splice(this.departmentService.departmentList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
            this.departmentService.departmentList$.next([...this.departmentService.departmentList$.value]);
          } else {
            this.departmentService.departmentList$.next([response.data, ...this.departmentService.departmentList$.value]);
          };
          this.handleCancel();
        };
      });
    } else {
      Object.values(this.departmentForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  randomColor() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    this.departmentForm.controls['color'].setValue(randomColor);
  }

  randomIcon() {
    const randomIcon = Math.floor(Math.random() * 179);
    this.departmentForm.controls['icon'].setValue(this.iconList[randomIcon]);
  }

  handleCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  resetForm() {
    this.departmentForm.reset();
    this.departmentForm.controls['color'].setValue('#00ff00');
    this.departmentForm.controls['icon'].setValue('house');
  }
}
