import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Login } from 'src/app/interfaces/interfaces';
import { LoginResponse } from 'src/app/interfaces/interfaceReponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading = new BehaviorSubject<boolean>(false);

  constructor(
    private notification: NzNotificationService,
    private router: Router,
    private apiService: ApiService
  ) {
    if (sessionStorage.getItem('user') || localStorage.getItem('user')) {
      this.isLogin.next(true);
    } else {
      this.isLogin.next(false);
    }
  }

  login(loginForm: Login) {
    this.loading.next(true);
    this.apiService.login(loginForm)
      .pipe(catchError((err) => {
        this.notification.error('Login Failed!!!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        if(response.statusCode == 200){
          if (loginForm.rememberMe == true) {
            localStorage.setItem('user', JSON.stringify(response.data));
          } else {
            sessionStorage.setItem('user', JSON.stringify(response.data));
          };
          this.notification.success(`Hello ${response.data.fullName}!`, '');
          this.router.navigate(['manage/home']);
          this.isLogin.next(true);
        }
        this.loading.next(false);
      });
  }

  logout(): void {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    this.router.navigate(['login']);
    this.isLogin.next(false);
  }
}
