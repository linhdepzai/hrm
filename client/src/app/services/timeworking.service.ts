import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { ApiResponse, TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { WorkingTimeRequest } from 'src/app/interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimeworkingService {
  public timeWorkingList$ = new BehaviorSubject<TimeWorkingResponse[]>([]);
  private baseUrl = environment.baseUrl + 'TimeWorking/' + JSON.parse(localStorage.getItem('user')!).id + '/'; 

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService,
    private httpClient: HttpClient,
  ) { }


  getAllTimeWorking() {
    return this.httpClient.get<ApiResponse>(this.baseUrl + 'get-all')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        const data = (response.data as TimeWorkingResponse[]).sort((a, b) => {
          return new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime();
        });
        this.timeWorkingList$.next(data);
      });;
  }

  requestChangeTimeWorking(payload: WorkingTimeRequest): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.baseUrl + 'request-change-timeWorking', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
  
  updateStatusChangeTimeWorking(payload: { id: string, status: number }): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'update-status', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
