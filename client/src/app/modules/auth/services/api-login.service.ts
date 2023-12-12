import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, catchError, of } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/interfaceReponse';
import { Login } from 'src/app/interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiLoginService {

  constructor(
    private httpClient: HttpClient,
    private notification: NzNotificationService,
    private message: NzMessageService,
  ) { }

  login(payload: Login): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'Account/login', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
