import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Status } from '../enums/Enum';
import { ApiResponse, TimeKeepingResponse } from '../interfaces/interfaceReponse';
import { ChangePassword, CheckinOrCheckout, CreateProject, Employee, Login, WorkingTimeRequest } from '../interfaces/interfaces';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private notification: NzNotificationService,
    private message: NzMessageService,
  ) { }

  login(payload: Login): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'account/login', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
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

  updateStatusUserInfo(payload: { id: string, status: Status }): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'employee/updateStatus', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getAllDepartment(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'department/getAll')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  saveDepartment(payload: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'department/save', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  deleteDepartment(id: any): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(environment.baseUrl + 'department/delete?id=' + id)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getAllEmployee(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'employee/getAll')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  saveEmployee(payload: Employee): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'employee/save', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  deleteEmployee(id: any): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(environment.baseUrl + 'employee/delete?id=' + id)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  requestOnLeave(payload: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'onleave/requestLeave', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getAllOnLeave(employeeId: string): Observable<ApiResponse> {
    const id = employeeId.trim() != '' ? '?id=' + employeeId : '';
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'onleave/getAll' + id)
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  deleteOnLeave(id: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(environment.baseUrl + 'onleave/delete?id=' + id)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getAllTimeWorking(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'timeworking/getAll')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  getAllProject(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'project/getall')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  getOnlyProject(projectId: string): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'project/getAProject?projectId=' + projectId)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  saveProject(payload: CreateProject): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'project/save', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getTimeKeepingForUser(id: string, month: number, year: number): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + `timekeeping/getTimeKeepingForUser?id=${id}&month=${month}&year=${year}`)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  checkinOrCheckout(payload: CheckinOrCheckout): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'timekeeping/checkinOrCheckout', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getAllRequestChangeInfo(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'employee/getAllRequestChangeInfo')
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }));
  }

  complainDailyCheckin(payload: any): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'timekeeping/complainDailyCheckin', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  changePassword(payload: ChangePassword): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'account/changePassword', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }));
  }

  requestChangeTimeWorking(payload: WorkingTimeRequest): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'timeworking/requestChangeTimeWorking', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getAllRequestChangeTimeWorkingForUser(id: string): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'account/getAllRequestChangeTimeWorkingForUser?id=' + id)
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }));
  }

  updateStatusChangeTimeWorking(payload: { id: string, status: number }): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'timeworking/updateStatus', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  updateStatusRequestOff(payload: { id: string, pmId: string, status: number }): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'onleave/updateStatus', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
