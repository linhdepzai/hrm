import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
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
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'Account/getAllRequestChangeTimeWorkingForUser?id=' + id)
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        this.requestTimeWorkingList$.next(response.data);
      });
  }

  changePassword(payload: ChangePassword): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'Account/changePassword', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }));
  }

  requestChangeInfor(payload: Employee): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'Account/requestChangeInfor', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.errors.message);
        return of(err);
      }));
  }

  changeAvatar(file: File): Observable<ApiResponse> {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    const formData = new FormData();
    formData.append('File', file, file.name);
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'account/changeAvatar/' + user.id, formData);
  }
}
