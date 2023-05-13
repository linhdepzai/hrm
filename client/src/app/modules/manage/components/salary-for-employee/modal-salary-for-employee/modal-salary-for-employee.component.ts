import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Salary, SalaryForEmployee } from 'src/app/interfaces/interfaceReponse';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { SalaryService } from 'src/app/services/salary.service';

@Component({
  selector: 'app-modal-salary-for-employee',
  templateUrl: './modal-salary-for-employee.component.html',
  styleUrls: ['./modal-salary-for-employee.component.css']
})
export class ModalSalaryForEmployeeComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() data!: SalaryForEmployee;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  salaryList = new Observable<Salary[]>();
  title: string = 'View';
  isEdit: boolean = false;
  salaryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private salaryService: SalaryService,
    private notification: NzNotificationService,
  ){}

  ngOnInit(): void {
    this.salaryList = this.salaryService.salaryList$;
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      this.isEdit = true;
      this.salaryForm.reset();
      this.salaryForm.patchValue(this.data);
      this.changeMode();
    }
  }

  initForm() {
    this.salaryForm = this.fb.group({
      id: [null],
      actionId: [null],
      salary: [null],
      date: [null],
      totalWorkdays: [null],
      punish: [true, Validators.required],
      bounty: [null, Validators.required],
      actualSalary: [null, Validators.required],
    });
  }
  
  changeMode() {
    this.isEdit = !this.isEdit;
    this.title = (this.isEdit ? 'Edit: ' : 'View: ') + this.getUserName(this.data.employeeId);
    if (this.isEdit) {
      this.salaryForm.enable();
    } else {
      this.salaryForm.disable();
    }
  }

  getUserName(id: string) {
    return this.employeeService.employeeList$.value.find(d => d.id == id)?.fullName;
  }

  submitForm() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.salaryForm.controls['actionId'].setValue(user.id);
    this.salaryService.updateSalary(this.salaryForm.value)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Successfully!', '');
          this.salaryService.salaryForEmployeeList$.value.splice(
            this.salaryService.salaryForEmployeeList$.value.findIndex((item) => item.id === response.data.id),
            1, response.data);
          this.salaryService.salaryForEmployeeList$.next([...this.salaryService.salaryForEmployeeList$.value]);
          this.cancel.emit();
        };
      });
  }

  handleCancel() {
    this.cancel.emit();
  }
}
