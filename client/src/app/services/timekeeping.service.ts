import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { ApiResponse, TimeKeepingResponse } from 'src/app/interfaces/interfaceReponse';
import { CheckinOrCheckout } from 'src/app/interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimekeepingService {
  public myTimeKeepingList$ = new BehaviorSubject<TimeKeepingResponse[]>([]);
  private baseUrl = environment.baseUrl + 'TimeKeeping/' + JSON.parse(localStorage.getItem('user')!).id + '/'; 

  constructor(
    private notification: NzNotificationService,
    private httpClient: HttpClient
  ) { }

  checkinOrCheckout(payload: CheckinOrCheckout): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.baseUrl + 'checkin-or-checkout', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  getTimeKeepingForUser(month: number, year: number) {
    return this.httpClient.get<ApiResponse>(this.baseUrl + `get-timeKeeping-for-user?month=${month}&year=${year}`)
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

  complainDailyCheckin(payload: any): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'complain-daily-checkin', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
