import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Login } from 'src/app/interfaces/interfaces';
import { ApiLoginService } from './api-login.service';
import { PresenceService } from 'src/app/services/presence.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading = new BehaviorSubject<boolean>(false);

  constructor(
    private notification: NzNotificationService,
    private router: Router,
    private apiLoginService: ApiLoginService,
    private presence: PresenceService,
  ) {
    if (sessionStorage.getItem('user') || localStorage.getItem('user')) {
      this.isLogin.next(true);
    } else {
      this.isLogin.next(false);
    }
  }

  login(loginForm: Login) {
    this.loading.next(true);
    this.apiLoginService.login(loginForm)
      .pipe(catchError((err) => {
        this.notification.error('Login Failed!!!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        if(response.statusCode == 200){
          this.getUserRole(response.data.role);
          if (loginForm.rememberMe == true) {
            localStorage.setItem('user', JSON.stringify(response.data));
          } else {
            sessionStorage.setItem('user', JSON.stringify(response.data));
          };
          this.presence.createHubConnection(response.data);
          this.notification.success(`Hello ${response.data.fullName}!`, '');
          this.isLogin.next(true);
          this.router.navigate(['member/home']);
        }
        this.loading.next(false);
      });
  }

  logout(): void {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = 'http://localhost:4200/login';
    this.presence.stopHubConnection();
    this.isLogin.next(false);
  }

  getUserRole(role: any[]){
    let userRole: string[] = [];
    role.forEach(item => { userRole.push(item.roleName) });
    localStorage.setItem('role', JSON.stringify(userRole));
  }
}
