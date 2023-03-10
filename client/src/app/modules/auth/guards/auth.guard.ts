import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { map, Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notification: NzNotificationService,
  ) { }

  canActivate(): Observable<boolean> {
    return this.authenticationService.isLogin.pipe(
      map(data => {
        if (data) { return true; } 
        else {
          this.notification.create('error', 'You must be login!!!', '');
          this.router.navigateByUrl('login');
          return false;
        }
      })
    );
  }
}