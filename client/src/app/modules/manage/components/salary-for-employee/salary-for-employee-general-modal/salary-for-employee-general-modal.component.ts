import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { Salary } from 'src/app/interfaces/interfaceReponse';
import { EmployeeService } from 'src/app/services/employee.service';
import { SalaryService } from 'src/app/services/salary.service';

@Component({
  selector: 'app-salary-for-employee-general-modal',
  templateUrl: './salary-for-employee-general-modal.component.html',
  styleUrls: ['./salary-for-employee-general-modal.component.css']
})
export class SalaryForEmployeeGeneralModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() data!: any;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  title: string = 'View';
  salaryForm!: FormGroup;
  salaryList = new Observable<Salary[]>();

  constructor(
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.salaryList = this.salaryService.salaryList$
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      this.salaryForm.reset();
      this.salaryForm.patchValue(this.data);
      this.salaryForm.controls['employeeId'].setValue(this.getUserName(this.data.appUserId));
      this.salaryForm.controls['employeeId'].disable();
    }
  }

  initForm() {
    this.salaryForm = this.fb.group({
      id: [null],
      employeeId: [null],
      salaryId: [null, Validators.required],
    });
  }

  getUserName(id: string) {
    return this.employeeService.employeeList$.value.find(d => d.appUserId == id)?.fullName;
  }

  submitForm() {
    this.salaryForm.controls['employeeId'].enable();
    this.salaryForm.controls['employeeId'].setValue(this.data.appUserId);
    if (this.salaryForm.valid) {
      this.salaryService.UpdateSalaryForEmployee(this.salaryForm.value)
        .subscribe((response) => {
          if (response.statusCode == 200) {
            this.notification.success('Successfully!', '');
            this.submit.emit();
          };
        });
    } else {
      Object.values(this.salaryForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  close() {
    this.cancel.emit();
  }
}
