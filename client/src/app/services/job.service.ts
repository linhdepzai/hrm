import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse, Job } from '../interfaces/interfaceReponse';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  public jobList$ = new BehaviorSubject<Job[]>([]);
  private baseUrl = environment.baseUrl + 'Job/' + JSON.parse(localStorage.getItem('user')!).id + '/'; 

  constructor(
    private notification: NzNotificationService,
    private httpClient: HttpClient,
    private message: NzMessageService,
  ) { }

  getAllJob() {
    return this.httpClient.get<ApiResponse>(this.baseUrl + 'get-all')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.jobList$.next(response.data);
      });
  }

  create(payload: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.baseUrl + 'create', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  save(payload: Job): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.baseUrl + 'save', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  delete(id: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.baseUrl + `delete?jobId=${id}`)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
