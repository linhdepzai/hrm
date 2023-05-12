import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoginResponse } from 'src/app/interfaces/interfaceReponse';
import { ChangePassword } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';

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
    private apiService: ApiService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
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
    if (this.changePasswordForm.valid) {
      this.changePasswordForm.value.id = this.user.id;
      this.apiService
      .changePassword(this.changePasswordForm.value as ChangePassword)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Successfully!!!', 'You have successfully changed your password!');
          this.cancel.emit();
        }
      });
    } else {
      Object.values(this.changePasswordForm.controls).forEach(control => {
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
}
