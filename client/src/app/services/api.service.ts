import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Status } from '../enums/Enum';
import { ApiResponse, TimeKeepingResponse } from '../interfaces/interfaceReponse';
import { ChangePassword, CheckinOrCheckout, CreateProject, Employee, Login, WorkingTimeRequest } from '../interfaces/interfaces';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private httpClient: HttpClient, private notification: NzNotificationService) { }

  login(payload: Login): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'account/login', payload);
  }

  requestChangeInfor(payload: Employee): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'account/requestChangeInfor', payload);
  }

  updateStatusUserInfo(payload: { id: string, status: Status }): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'employee/updateStatus', payload);
  }

  getAllDepartment(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'department/getAll');
  }

  saveDepartment(payload: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'department/save', payload);
  }

  deleteDepartment(id: any): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(environment.baseUrl + 'department/delete?id=' + id);
  }

  getAllEmployee(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'employee/getAll');
  }

  saveEmployee(payload: Employee): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'employee/save', payload);
  }

  deleteEmployee(id: any): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(environment.baseUrl + 'employee/delete?id=' + id);
  }

  requestOnLeave(payload: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'onleave/requestLeave', payload);
  }

  getAllOnLeave(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'onleave/getAll');
  }

  deleteOnLeave(id: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(environment.baseUrl + 'onleave/delete?id=' + id);
  }

  getAllTimeWorking(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'timeworking/getAll');
  }

  getAllProject(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'project/getall');
  }

  getOnlyProject(projectId: string): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'project/getAProject?projectId=' + projectId);
  }

  saveProject(payload: CreateProject): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'project/save', payload);
  }

  getTimeKeepingForUser(id: string, month: number, year: number): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + `timekeeping/getTimeKeepingForUser?id=${id}&month=${month}&year=${year}`);
  }

  checkinOrCheckout(payload: CheckinOrCheckout): Observable<TimeKeepingResponse> {
    return this.httpClient.post<TimeKeepingResponse>(environment.baseUrl + 'timekeeping/checkinOrCheckout', payload);
  }

  getAllRequestChangeInfo(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'employee/getAllRequestChangeInfo');
  }

  complainDailyCheckin(payload: any): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'timekeeping/complainDailyCheckin', payload);
  }

  changePassword(payload: ChangePassword): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'account/changePassword', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }));
  }

  requestChangeTimeWorking(payload: WorkingTimeRequest): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'timeworking/requestChangeTimeWorking', payload);
  }

  getAllRequestChangeTimeWorkingForUser(id: string): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'account/getAllRequestChangeTimeWorkingForUser?id=' + id);
  }

  updateStatusChangeTimeWorking(payload: {id: string, status: number}): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'timeworking/updateStatus', payload);
  }
}
