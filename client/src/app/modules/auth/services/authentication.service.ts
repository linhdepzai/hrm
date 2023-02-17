import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoginForm } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private notification: NzNotificationService,
    private router: Router,
    private apiService: ApiService
  ) {
    if (sessionStorage.getItem('accessToken')) {
      this.isLogin.next(true);
    } else {
      this.isLogin.next(false);
    }
  }

  login(loginForm: LoginForm) {
    this.apiService.login(loginForm)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response.success){
          sessionStorage.setItem('accessToken', JSON.stringify(response.result.accessToken));
          this.notification.create('success', 'Successfully!', '');
          this.router.navigate(['projects']);
          this.isLogin.next(true);
        } else {
          this.notification.create('error', response?.error?.error?.message, response?.error?.error?.details);
        }
      });
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
    this.isLogin.next(false);
    this.router.navigate(['login']);
  }
}
