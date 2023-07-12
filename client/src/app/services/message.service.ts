import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable, catchError, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../interfaces/interfaces';
import { ApiResponse, LoginResponse } from '../interfaces/interfaceReponse';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.baseUrl + 'Message/';
  hubUrl = environment.hubUrl;
  private hubConnection!: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread = this.messageThreadSource.asObservable();
  // messageSource = new BehaviorSubject<Message[]>([]);

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
  ) { }

  getMessages(): Observable<ApiResponse> {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    return this.http.get<ApiResponse>(this.baseUrl + 'getAll?id=' + user.id)
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  // getMessageThread(id: string) {
  //   const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  //   return this.http.get<ApiResponse>(this.baseUrl + 'thread/' + id + '?currentUserId=' + user.id)
  //     .pipe(catchError((err) => {
  //       this.message.error('Server not responding!!!', { nzDuration: 3000 });
  //       return of(err);
  //     }))
  //     .subscribe((response) => {
  //       this.messageSource.next(response.data);
  //     });
  // }

  createHubConnection(user: LoginResponse, recipientUserId: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?currentUserId=' + user.id + '&recipientUserId=' + recipientUserId, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
    });

    this.hubConnection.on('NewMessage', message => {
      this.messageThread.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message])
      })
    })
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  // sendMessage(payload: any): Observable<ApiResponse> {
  //   return this.http.post<ApiResponse>(this.baseUrl + 'create', payload)
  //     .pipe(catchError((err) => {
  //       this.message.error('Server not responding!!!', { nzDuration: 3000 });
  //       return of(err);
  //     }))
  // }

  async sendMessage(payload: any) {
    return this.hubConnection.invoke('SendMessage', payload)
      .catch(error => console.log(error));
  }
}
