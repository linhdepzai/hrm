import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Bank, Level } from 'src/app/enums/Enum';
import { DepartmentResponse, LoginResponse, Position } from 'src/app/interfaces/interfaceReponse';
import { DataService } from 'src/app/services/data.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DepartmentService } from 'src/app/services/department.service';
import { AccountService } from 'src/app/services/account.service';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-modal-change-info',
  templateUrl: './modal-change-info.component.html',
  styleUrls: ['./modal-change-info.component.css']
})
export class ModalChangeInfoComponent implements OnInit, OnChanges {
  @Input() isVisibleModal: boolean = false;
  @Input() user!: LoginResponse;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  infoForm!: FormGroup;
  levelList = new Observable<{ value: Level; label: string }[]>();
  positionList = new Observable<Position[]>();
  bankList = new Observable<Bank[]>();
  departmentList = new Observable<DepartmentResponse[]>();

  constructor(
    private accountService: AccountService,
    private notification: NzNotificationService,
    private dataService: DataService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.bankList = this.dataService.bankList;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeInfoForm();
    this.infoForm.patchValue(this.user);
  }

  changeInfoForm() {
    this.infoForm = this.fb.group({
      phone: [null, Validators.required],
      bank: [null],
      bankAccount: [null],
      taxCode: [null],
      insuranceStatus: [null],
      placeOfOrigin: [null],
      placeOfResidence: [null],
      dateOfIssue: [null],
      issuedBy: [null],
    });
  }

  submitForm() {
    if (this.infoForm.valid) {
      this.accountService
        .requestChangeInfor(this.infoForm.value)
        .subscribe((response) => {
          if (response.statusCode == 200) {
            this.notification.success('Request success!', '');
            this.handleCancel();
          }
        });
    } else {
      Object.values(this.infoForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel() {
    this.infoForm.reset();
    this.cancel.emit();
  }
}
