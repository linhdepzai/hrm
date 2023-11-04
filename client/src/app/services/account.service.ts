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
  private baseUrl = environment.baseUrl + 'Account/' + JSON.parse(localStorage.getItem('user')!).id + '/';

  constructor(
    private httpClient: HttpClient,
    private notification: NzNotificationService,
  ) { }

  getAllRequestChangeTimeWorkingForUser() {
    return this.httpClient.get<ApiResponse>(this.baseUrl + 'get-all-request-change-timeWorking')
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        this.requestTimeWorkingList$.next(response.data);
      });
  }

  changePassword(payload: ChangePassword): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(this.baseUrl + 'change-password', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }));
  }

  requestChangeInfor(payload: Employee): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(this.baseUrl + 'request-change-infor', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.errors.message);
        return of(err);
      }));
  }

  changeAvatar(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('File', file, file.name);
    return this.httpClient.post<ApiResponse>(this.baseUrl + 'change-avatar', formData);
  }
}
