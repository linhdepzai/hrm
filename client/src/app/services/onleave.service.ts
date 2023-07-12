import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { ApiResponse, OnLeaveResponse } from 'src/app/interfaces/interfaceReponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnleaveService {
  public onLeaveList$ = new BehaviorSubject<OnLeaveResponse[]>([]);

  constructor(
    private notification: NzNotificationService,
    private httpClient: HttpClient,
    private message: NzMessageService,
  ) { }

  requestOnLeave(payload: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'OnLeave/requestLeave', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getAllRequestOnLeave() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'OnLeave/getAllRequest/' + user.id)
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.onLeaveList$.next(response.data);
      });
  }

  getAllOnLeave(employeeId: string) {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'OnLeave/getAll/' + employeeId)
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.onLeaveList$.next(response.data);
      });
  }

  deleteOnLeave(id: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(environment.baseUrl + 'OnLeave/delete?id=' + id)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  updateStatusRequestOff(payload: { id: string, pmId: string, status: number }) {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'OnLeave/updateStatus', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
