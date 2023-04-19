import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { TimeKeepingResponse } from 'src/app/interfaces/interfaceReponse';
import { CheckinOrCheckout } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TimekeepingService {
  public myTimeKeepingList$ = new BehaviorSubject<TimeKeepingResponse[]>([]);

  constructor(
    private apiService: ApiService,
    private notification: NzNotificationService,
    private datepipe: DatePipe,
  ) { 
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.getTimeKeepingForUser(user.id, new Date().getMonth() + 1, new Date().getFullYear());
  }

  checkinOrCheckout(data: CheckinOrCheckout) {
    this.apiService
      .checkinOrCheckout(data)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.myTimeKeepingList$.value.splice(this.myTimeKeepingList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
          this.myTimeKeepingList$.next([...this.myTimeKeepingList$.value]);
          const timeCheckin = this.datepipe.transform(response.checkin, 'HH:mm');
          this.notification.success('Checkin success!!!', 'You checkin at ' + timeCheckin);
        }
      });
  }

  getTimeKeepingForUser(id: string, month: number, year: number) {
    this.apiService
      .getTimeKeepingForUser(id, month, year)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        const myTimeKeepingList = (response.data as TimeKeepingResponse[]).sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.myTimeKeepingList$.next(myTimeKeepingList);
      });
  }
  

  complainDailyCheckin(payload: { id: string, complain: string }) {
    this.apiService
      .complainDailyCheckin(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        this.myTimeKeepingList$.value.splice(this.myTimeKeepingList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
        this.myTimeKeepingList$.next([...this.myTimeKeepingList$.value]);
      });
  }
}
