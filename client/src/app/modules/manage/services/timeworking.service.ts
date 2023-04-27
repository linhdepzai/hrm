import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { WorkingTimeRequest } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { AccountService } from './account.service';
import { Status } from 'src/app/enums/Enum';

@Injectable({
  providedIn: 'root'
})
export class TimeworkingService {
  public timeWorkingList$ = new BehaviorSubject<TimeWorkingResponse[]>([]);

  constructor(
    private apiService: ApiService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private accountService: AccountService,
  ) { }

  getAllTimeWorking() {
    this.apiService
      .getAllTimeWorking()
      .subscribe((response) => {
        const data = (response.data as TimeWorkingResponse[]).sort((a, b) => {
          return new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime();
        });
        this.timeWorkingList$.next(data);
      });
  }

  requestChangeTimeWorking(payload: WorkingTimeRequest) {
    this.apiService
      .requestChangeTimeWorking(payload)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          response.data.morningStartTime = new Date(new Date(response.data.morningStartTime).getTime() - 7 * 60 * 60 * 1000);
          response.data.morningEndTime = new Date(new Date(response.data.morningEndTime).getTime() - 7 * 60 * 60 * 1000);
          response.data.afternoonStartTime = new Date(new Date(response.data.afternoonStartTime).getTime() - 7 * 60 * 60 * 1000);
          response.data.afternoonEndTime = new Date(new Date(response.data.afternoonEndTime).getTime() - 7 * 60 * 60 * 1000);
          response.data.applyDate = new Date(new Date(response.data.applyDate).getTime() - 7 * 60 * 60 * 1000);
          if (this.accountService.requestTimeWorkingList$.value.find(i => i.status == Status.Pending)) {
            this.accountService.requestTimeWorkingList$.value.splice(this.accountService.requestTimeWorkingList$.value.findIndex((item) => item.status === Status.Pending), 1, response.data);
            this.accountService.requestTimeWorkingList$.next([...this.accountService.requestTimeWorkingList$.value]);
          } else {
            this.accountService.requestTimeWorkingList$.next([...this.accountService.requestTimeWorkingList$.value, response.data]);
          }
        }
      });
  }

  updateStatusChangeTimeWorking(payload: { id: string, status: number }) {
    this.apiService
      .updateStatusChangeTimeWorking(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        this.timeWorkingList$.value.splice(this.timeWorkingList$.value.findIndex((item) => item.id == response.data.id), 1, response.data);
        this.timeWorkingList$.next([...this.timeWorkingList$.value]);
      });
  }
}
