import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Bank, Level, Position } from 'src/app/enums/Enum';
import { DepartmentResponse, LoginResponse } from 'src/app/interfaces/interfaceReponse';
import { DataService } from 'src/app/services/data.service';
import { DepartmentService } from '../../../services/department.service';
import { AccountService } from '../../../services/account.service';

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
  positionList = new Observable<{ value: Position; label: string }[]>();
  bankList = new Observable<Bank[]>();
  departmentList = new Observable<DepartmentResponse[]>();

  constructor(
    private departmentService: DepartmentService,
    private accountService: AccountService,
    private dataService: DataService,
    private fb: FormBuilder,
  ) { }
  
  ngOnInit(): void {
    this.departmentList = this.departmentService.departmentList$;
    this.levelList = this.dataService.levelList;
    this.positionList = this.dataService.positionList;
    this.bankList = this.dataService.bankList;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeInfoForm();
    this.infoForm.patchValue(this.user);
  }

  changeInfoForm() {
    this.infoForm = this.fb.group({
      id: [null, Validators.required],
      userCode: [null, Validators.required],
      fullName: [null, Validators.required],
      sex: [true, Validators.required],
      email: [null, Validators.required],
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
    if (this.infoForm.valid) {
      this.infoForm.controls['userCode'].setValue(this.user.userCode);
      this.accountService.requestChangeInfor(this.infoForm.value);
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
