import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { ApiResponse, Salary, SalaryForEmployee } from 'src/app/interfaces/interfaceReponse';
import { environment } from 'src/environments/environment';
import { NotificationSalaryPayload, UpdateSalaryPayload } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  salaryList$ = new BehaviorSubject<Salary[]>([]);
  salaryForEmployeeList$ = new BehaviorSubject<SalaryForEmployee[]>([]);

  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private notification: NzNotificationService,
  ) { }

  getAllSalary() {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'Salary/getAll')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        if (response.statusCode == 200) {
          const data = (response.data as Salary[]).sort((a, b) => {
            return b.money - a.money;
          });
          this.salaryList$.next(data);
        }
      });
  }

  createSalary(payload: Salary): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'Salary/create', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getAllSalaryForEmployee(month?: number, year?: number) {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + `Salary/getAllSalaryForEmployee?month=${month}&year=${year}`)
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.salaryForEmployeeList$.next(response.data);
        }
      });
  }

  updateSalary(payload: UpdateSalaryPayload): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'salary/update', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  sendNotificationSalary(payload: NotificationSalaryPayload): Observable<ApiResponse> {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    payload.actionId = user.id;
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'salary/sendNotificationSalary', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  confirmSalary(id: string, confirm: number): Observable<ApiResponse> {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    return this.httpClient.put<ApiResponse>(environment.baseUrl + `salary/confirmSalary/${user.id}?salaryId=${id}&confirm=${confirm}`, null)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  GetSalaryForEmployee(): Observable<ApiResponse> {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    return this.httpClient.get<ApiResponse>(environment.baseUrl + `salary/getSalaryForEmployee`)
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  UpdateSalaryForEmployee(value: any): Observable<ApiResponse> {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    return this.httpClient.put<ApiResponse>(environment.baseUrl + `salary/updateSalaryForEmployee/${value.employeeId}?salaryId=${value.salary}`, null)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}