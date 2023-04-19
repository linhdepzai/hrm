import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Employee } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public requestChangeInfoList$ = new BehaviorSubject<Employee[]>([]);
  
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

  changePassword(payload: { id: string, password: string }) {
    this.apiService
      .changePassword(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Successfully!!!', 'You have successfully changed your password!');
        }
      });
  }
}
