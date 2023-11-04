import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoginResponse } from 'src/app/interfaces/interfaceReponse';
import { ChangePassword } from 'src/app/interfaces/interfaces';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.css']
})
export class ModalChangePasswordComponent implements OnInit {
  @Input() isVisibleModal: boolean = false;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  changePasswordForm!: FormGroup;
  user: LoginResponse = JSON.parse(localStorage.getItem('user')!);

  constructor(
    private accountService: AccountService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

  submitForm() {
    if (this.changePasswordForm.valid &&
      this.changePasswordForm.value.newPassword == this.changePasswordForm.value.confirmPassword
      ) {
      this.accountService
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
