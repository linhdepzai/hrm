import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { ApiResponse, DepartmentResponse } from 'src/app/interfaces/interfaceReponse';
import { Department } from 'src/app/interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  public departmentList$ = new BehaviorSubject<DepartmentResponse[]>([]);

  constructor(
    private notification: NzNotificationService,
    private httpClient: HttpClient,
    private message: NzMessageService,
  ) { }

  getAllDepartment() {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'department/getAll')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.departmentList$.next(response.data as DepartmentResponse[]);
      });
  }

  saveDepartment(payload: Department): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'department/save', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  deleteDepartment(id: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(environment.baseUrl + 'department/delete?id=' + id)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
