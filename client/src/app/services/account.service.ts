import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { ApiResponse, TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { ChangePassword, Employee } from 'src/app/interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public requestTimeWorkingList$ = new BehaviorSubject<TimeWorkingResponse[]>([]);
  public isSuccess: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private notification: NzNotificationService,
  ) { }

  getAllRequestChangeTimeWorkingForUser(id: string) {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'account/getAllRequestChangeTimeWorkingForUser?id=' + id)
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        this.requestTimeWorkingList$.next(response.data);
      });
  }

  changePassword(payload: ChangePassword): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'account/changePassword', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }));
  }

  requestChangeInfor(payload: Employee): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'account/requestChangeInfor', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
