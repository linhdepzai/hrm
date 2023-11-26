import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { ApiResponse, IssueResponse } from '../interfaces/interfaceReponse';
import { environment } from 'src/environments/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public issueList$ = new BehaviorSubject<IssueResponse[]>([]);
  private baseUrl = environment.baseUrl + 'Task/' + JSON.parse(localStorage.getItem('user')!).id + '/';

  constructor(
    private httpClient: HttpClient,
    private notification: NzNotificationService,
  ) { }

  getAllIssue() {
    return this.httpClient.get<ApiResponse>(this.baseUrl + 'get-all')
    .pipe(catchError((err) => {
      this.notification.error('Error!', err.error.message);
      return of(err);
    }))
    .subscribe((response) => {
      this.issueList$.next(response.data);
    });
  }
}
