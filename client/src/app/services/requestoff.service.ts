import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { ApiResponse, RequestOffResponse } from 'src/app/interfaces/interfaceReponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestOffService {
  public requestOffList$ = new BehaviorSubject<RequestOffResponse[]>([]);
  private baseUrl = environment.baseUrl + 'RequestOff/' + JSON.parse(localStorage.getItem('user')!).id + '/'; 

  constructor(
    private notification: NzNotificationService,
    private httpClient: HttpClient,
    private message: NzMessageService,
  ) { }

  requestOff(payload: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.baseUrl + 'request-off', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getAllRequestOff() {
    return this.httpClient.get<ApiResponse>(this.baseUrl + 'get-all-request')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.requestOffList$.next(response.data);
      });
  }

  getAllOff() {
    return this.httpClient.get<ApiResponse>(this.baseUrl + 'get-all')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.requestOffList$.next(response.data);
      });
  }

  deleteRequestOff(id: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.baseUrl + 'delete?id=' + id)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  updateStatusRequestOff(payload: { id: string, status: number }) {
    return this.httpClient.put<ApiResponse>(this.baseUrl + 'update-status', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
