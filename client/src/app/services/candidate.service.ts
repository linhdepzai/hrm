import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse, Candidate } from '../interfaces/interfaceReponse';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  public candidateList$ = new BehaviorSubject<Candidate[]>([]);
  private baseUrl = environment.baseUrl + 'Candidate/' + JSON.parse(localStorage.getItem('user')!).id + '/'; 

  constructor(
    private notification: NzNotificationService,
    private httpClient: HttpClient,
    private message: NzMessageService,
  ) { }

  getAllCandidate() {
    return this.httpClient.get<ApiResponse>(this.baseUrl + 'get-all')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.candidateList$.next(response.data);
      });
  }

  uploadCV(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('File', file, file.name);
    return this.httpClient.post<ApiResponse>(this.baseUrl + 'upload-cv', formData);
  }

  create(payload: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.baseUrl + 'create', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  update(payload: Candidate): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.baseUrl + 'update', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }

  delete(id: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.baseUrl + `delete?id=${id}`)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
