import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, Notification } from '../interfaces/interfaceReponse';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NotificationPayload } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notificationList$ = new BehaviorSubject<Notification[]>([]);

  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private notification: NzNotificationService,
  ) { }

  getAllNotification() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    return this.httpClient.get<ApiResponse>(environment.baseUrl + `notification/getAll/${user.id}`)
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.notificationList$.next(response.data);
      });
  }

  getOnlyNotification(id: string) {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + `notification/getANotification/${id}`)
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  readNotification(id: string) {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    return this.httpClient.get<ApiResponse>(environment.baseUrl + `notification/readNotification/${user.id}?id=${id}`)
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  saveNotification(payload: NotificationPayload):Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'notification/save', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }))
  }
}
