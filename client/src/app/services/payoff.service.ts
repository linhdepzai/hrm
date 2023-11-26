import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { ApiResponse, Payoff } from 'src/app/interfaces/interfaceReponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayoffService {
  payoffList$ = new BehaviorSubject<Payoff[]>([]);
  private baseUrl = environment.baseUrl + 'Payoff/' + JSON.parse(localStorage.getItem('user')!).id + '/';

  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private notification: NzNotificationService,
  ) { }

  getAllPayoff() {
    return this.httpClient.get<ApiResponse>(this.baseUrl + 'get-all/')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.payoffList$.next(response.data);
      });
  }

  savePayoff(payload: Payoff): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.baseUrl + 'Save', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  deletePayoff(id: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.baseUrl + `delete?payoffId=${id}`)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
