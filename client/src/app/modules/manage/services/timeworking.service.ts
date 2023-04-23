import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { WorkingTimeRequest } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TimeworkingService {
  public timeWorkingList$ = new BehaviorSubject<TimeWorkingResponse[]>([]);

  constructor(
    private apiService: ApiService,
    private message: NzMessageService,
    private notification: NzNotificationService,
  ) {
    this.getAllTimeWorking();
  }

  getAllTimeWorking() {
    this.apiService
      .getAllTimeWorking()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
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
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        this.timeWorkingList$.next([response.data, ...this.timeWorkingList$.value]);
      });
  }
}
