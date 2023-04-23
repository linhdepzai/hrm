import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { ChangePassword, Employee } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public requestChangeInfoList$ = new BehaviorSubject<Employee[]>([]);
  public requestTimeWorkingList$ = new BehaviorSubject<TimeWorkingResponse[]>([]);
  public isSuccess: boolean = false;

  constructor(
    private apiService: ApiService,
    private notification: NzNotificationService,
  ) { }

  requestChangeInfor(data: Employee) {
    this.apiService
      .requestChangeInfor(data)
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Request success!', '');
        }
      });
  }

  getAllRequestChangeInfo() {
    this.apiService
      .getAllRequestChangeInfo()
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        this.requestChangeInfoList$.next(response.data as Employee[]);
      });
  }

  getAllRequestChangeTimeWorkingForUser(id: string) {
    this.apiService
      .getAllRequestChangeTimeWorkingForUser(id)
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        this.requestTimeWorkingList$.next(response.data);
      });
  }
}
