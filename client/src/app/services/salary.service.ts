import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { ApiResponse, Salary, SalaryForEmployee } from 'src/app/interfaces/interfaceReponse';
import { environment } from 'src/environments/environment';
import { Level } from '../enums/Enum';
import { DataService } from './data.service';

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
    private dataService: DataService,
  ) { }

  getAllSalary() {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'salary/getAll')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        if (response.statusCode == 200) {
          const data = (response.data as Salary[]).sort((a,b) => {
            return b.money - a.money;
          });
          this.salaryList$.next(data);
        }
      });
  }

  createSalary(payload: Salary): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'salary/create', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getAllSalaryForEmployee() {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'salary/getAllSalaryForEmployee')
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

  updateSalary(payload: any): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'salary/update', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}