import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Payoff } from 'src/app/interfaces/interfaceReponse';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/services/data.service';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/interfaces/interfaces';
import { EmployeeService } from 'src/app/services/employee.service';
import { PayoffService } from 'src/app/services/payoff.service';

@Component({
  selector: 'app-modal-payoff',
  templateUrl: './modal-payoff.component.html',
  styleUrls: ['./modal-payoff.component.css']
})
export class ModalPayoffComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() data: Payoff | undefined;
  @Input() mode: string= 'create';
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  title: string = 'View';
  isEdit: boolean = false;
  payoffForm!: FormGroup;
  employeeList = new Observable<Employee[]>();

  constructor(
    private employeeService: EmployeeService,
    private payoffService: PayoffService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
  ) { 
    this.initForm(); 
  }

  ngOnInit(): void {
    this.employeeList = this.employeeService.employeeList$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.payoffForm.reset();
    this.isEdit = true;
    if (this.mode == 'create') {
      this.title = 'Create';
      this.payoffForm.enable();
    } else {
      this.payoffForm.patchValue(this.data!);
      this.changeMode();
    }
  }

  initForm() {
    this.payoffForm = this.fb.group({
      id: [null],
      actionId: [null],
      employeeId: [null, Validators.required],
      amount: [null, Validators.required],
      punish: [null, Validators.required],
      reason: [null, Validators.required],
      date: [null, Validators.required],
    });
  }

  getUserName(id: string) {
    return this.employeeService.employeeList$.value.find(d => d.id == id)?.fullName;
  }

  changeMode() {
    this.isEdit = !this.isEdit;
    this.title = (this.isEdit ? 'Edit: ' : 'View: ') + this.getUserName(this.data!.employeeId);
    if (this.isEdit) {
      this.payoffForm.enable();
    } else {
      this.payoffForm.disable();
    }
  }

  submitForm() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.payoffForm.controls['actionId'].setValue(user.id);
    this.payoffService.savePayoff(this.payoffForm.value)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Successfully!', '');
          this.payoffService.payoffList$.value.splice(
            this.payoffService.payoffList$.value.findIndex((item) => item.id === response.data.id),
            1, response.data);
          this.payoffService.payoffList$.next([...this.payoffService.payoffList$.value]);
          this.cancel.emit();
        };
      });
  }

  close() {
    this.cancel.emit();
  }
}
