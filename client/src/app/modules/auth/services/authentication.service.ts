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
    this.apiService.login(loginForm)
      .pipe(catchError((err) => of(err)))
      .subscribe((response: LoginResponse) => {
        if (response.id){
          if(loginForm.rememberMe == true){
            localStorage.setItem('user', JSON.stringify(response));
          } else {
            sessionStorage.setItem('user', JSON.stringify(response));
          };
          this.notification.create('success', `Hello ${response.fullName}!`, '');
          this.router.navigate(['manage/home']);
          this.isLogin.next(true);
        } else {
          this.notification.error('Login Failed!!!', 'Your email or password is incorrected!!!');
        }
      });
  }

  logout(): void {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    this.router.navigate(['login']);
    this.isLogin.next(false);
  }
}
