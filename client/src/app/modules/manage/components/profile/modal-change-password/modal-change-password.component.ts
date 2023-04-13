import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoginResponse } from 'src/app/interfaces/interfaceReponse';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.css']
})
export class ModalChangePasswordComponent implements OnInit {
  @Input() isVisibleModal: boolean = false;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  changePasswordForm!: FormGroup;
  user!: LoginResponse;

  constructor(
    private fb: FormBuilder,
    private manageService: ManageService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.changePasswordForm = this.fb.group({
      id: [this.user.id, Validators.required],
      email: [null, Validators.required],
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });
  }

  submitForm() {
    this.changePasswordForm.value.id = this.user.id;
    this.manageService.changePassword(this.changePasswordForm.value);
  }

  handleCancel() {
    this.cancel.emit();
  }
}
