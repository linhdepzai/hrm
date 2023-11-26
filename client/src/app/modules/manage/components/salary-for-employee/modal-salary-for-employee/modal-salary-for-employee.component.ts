import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Salary, SalaryForEmployee } from 'src/app/interfaces/interfaceReponse';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { SalaryService } from 'src/app/services/salary.service';

@Component({
  selector: 'app-modal-salary-for-employee',
  templateUrl: './modal-salary-for-employee.component.html',
  styleUrls: ['./modal-salary-for-employee.component.css'],
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
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.salaryList = this.salaryService.salaryList$;
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      this.isEdit = true;
      this.salaryForm.reset();
      this.salaryForm.patchValue(this.data);
      this.getInfoSalary();
      this.changeMode();
    }
  }

  initForm() {
    this.salaryForm = this.fb.group({
      id: [null],
      salary: [null],
      totalWorkdays: [null],
      money: [null],
      welfare: [null],
      punish: [true, Validators.required],
      bounty: [null, Validators.required],
      actualSalary: [null, Validators.required],
    });
  }

  changeMode() {
    this.isEdit = !this.isEdit;
    const mon = this.data.date ? new Date(this.data.date).getMonth() : '00';
    this.title =
      (this.isEdit ? 'Edit: ' : 'View: ') + this.getUserName(this.data.userId) + '\'s salary in ' + mon;
    if (this.isEdit) {
      this.salaryForm.enable();
      this.salaryForm.controls['actualSalary'].disable();
      this.salaryForm.controls['money'].disable();
      this.salaryForm.controls['welfare'].disable();
    } else {
      this.salaryForm.disable();
    }
  }

  getUserName(id: string) {
    return this.employeeService.employeeList$.value.find(
      (d) => d.appUserId == id
    )?.fullName;
  }

  submitForm() {
    if (this.salaryForm.valid) {
      this.salaryService
        .updateSalary(this.salaryForm.value)
        .subscribe((response) => {
          if (response.statusCode == 200) {
            this.notification.success('Successfully!', '');
            this.salaryService.salaryForEmployeeList$.value.splice(
              this.salaryService.salaryForEmployeeList$.value.findIndex(
                (item) => item.id === response.data.id
              ),
              1,
              response.data
            );
            this.salaryService.salaryForEmployeeList$.next([
              ...this.salaryService.salaryForEmployeeList$.value,
            ]);
            this.cancel.emit();
          }
        });
    } else {
      Object.values(this.salaryForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel() {
    this.cancel.emit();
  }

  getInfoSalary() {
    const sal = this.salaryService.salaryList$.value.find(
      (i) => i.id == this.salaryForm.value.salary
    );
    this.salaryForm.controls['money'].setValue(sal?.money);
    this.salaryForm.controls['welfare'].setValue(sal?.welfare);
  }
}
