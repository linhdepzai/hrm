import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { ApiResponse, Evaluate } from 'src/app/interfaces/interfaceReponse';
import { environment } from 'src/environments/environment';
import { Level } from '../enums/Enum';

@Injectable({
  providedIn: 'root'
})
export class EvaluateService {
  evaluateList$ = new BehaviorSubject<Evaluate[]>([]);

  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private notification: NzNotificationService,
  ) { }

  getAllEvaluate(month: number, year: number) {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    return this.httpClient.get<ApiResponse>(environment.baseUrl + `evaluate/Evaluate/${user.id}?month=${month}&year=${year}`)
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.evaluateList$.next(response.data);
      });
  }

  updateEvaluate(payload: { id: string, newLevel: Level, note: string }): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.baseUrl + 'evaluate/Update', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
