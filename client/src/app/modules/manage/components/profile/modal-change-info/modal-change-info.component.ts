import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Bank, Level, Position } from 'src/app/enums/Enum';
import { Department } from 'src/app/interfaces/interfaceRequest';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'app-modal-change-info',
  templateUrl: './modal-change-info.component.html',
  styleUrls: ['./modal-change-info.component.css']
})
export class ModalChangeInfoComponent implements OnInit {
  @Input() isVisibleModal: boolean = false;
  @Input() user: any;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  infoForm!: FormGroup;
  levelList = new Observable<any[]>();
  positionList = new Observable<any[]>();
  bankList = new Observable<Bank[]>();
  departmentList = new Observable<Department[]>();

  constructor(
    private manageService: ManageService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.changeInfoForm();
    this.departmentList = this.manageService.departmentList$;
    this.levelList = this.manageService.levelList;
    this.positionList = this.manageService.positionList;
    this.bankList = this.manageService.bankList;
  }

  changeInfoForm() {
    this.infoForm = this.fb.group({
      id: [null, Validators.required],
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
    this.infoForm.patchValue(this.user);
  }

  submitForm() {
    if (this.infoForm.valid) {
      this.manageService.saveEmployee(this.infoForm.value);
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
