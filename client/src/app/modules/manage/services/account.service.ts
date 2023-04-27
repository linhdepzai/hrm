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
  ) { 
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.getAllRequestChangeTimeWorkingForUser(user.id);
  }

  requestChangeInfor(data: Employee) {
    this.apiService
      .requestChangeInfor(data)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Request success!', '');
        }
      });
  }

  getAllRequestChangeTimeWorkingForUser(id: string) {
    this.apiService
      .getAllRequestChangeTimeWorkingForUser(id)
      .subscribe((response) => {
        this.requestTimeWorkingList$.next(response.data);
      });
  }
}
