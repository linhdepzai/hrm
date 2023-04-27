import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
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
      .subscribe((response) => {
        if (response.statusCode == 200) {
          if(response.data.photoCheckout == null) {
            response.data.checkin = new Date(new Date(response.data.checkin).getTime() - 7 * 60 * 60 * 1000);
            const timeCheckin = this.datepipe.transform(response.data.checkin, 'HH:mm');
            this.notification.success('Checkin success!!!', 'You checkin at ' + timeCheckin);
          } else {
            response.data.checkout = new Date(new Date(response.data.checkout).getTime() - 7 * 60 * 60 * 1000);
            const timeCheckout = this.datepipe.transform(response.data.checkout, 'HH:mm');
            this.notification.success('Checkout success!!!', 'You checkout at ' + timeCheckout);
          }
          this.myTimeKeepingList$.value.splice(this.myTimeKeepingList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
          this.myTimeKeepingList$.next([...this.myTimeKeepingList$.value]);
        }
      });
  }

  getTimeKeepingForUser(id: string, month: number, year: number) {
    this.apiService
      .getTimeKeepingForUser(id, month, year)
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
