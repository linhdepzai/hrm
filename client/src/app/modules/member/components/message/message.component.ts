import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from 'src/app/interfaces/interfaceReponse';
import { Employee, Message } from 'src/app/interfaces/interfaces';
import { EmployeeService } from 'src/app/services/employee.service';
import { MessageService } from 'src/app/services/message.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {
  employeeList = new Observable<Employee[]>();
  messageList: Message[] = [];
  user!: LoginResponse;
  isVisibleCurrentMessage: boolean = false;
  recipient!: { id: string, name: string, photoUrl: string };

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    public presence: PresenceService
  ) { }
  
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.isVisibleCurrentMessage = false;
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.employeeService.getAllEmployee();
    this.messageService.getMessages().subscribe((response) => {
      this.messageList = response.data;
    });
    this.employeeList = this.employeeService.employeeList$;
  }

  getTheLastMessageContent(id: string) {
    let content = this.messageList.find(i => i.senderId == id || i.recipientId == id)?.content;
    if (content == undefined) content = "No messages yet... say hi by using the message box below";
    return content;
  }

  getTheLastMessageTime(id: string) {
    const time = this.messageList.find(i => i.senderId == id || i.recipientId == id)?.messageSent!;
    if (time == undefined) return '';
    const countdown = Math.floor((new Date().getTime() - new Date(time).getTime()) / 60000);
    let display = '';
    if (Math.floor(countdown / 60) > 24) {
      display = Math.floor(countdown / 60 / 24).toString();
      display += Math.floor(countdown / 60 / 24) == 1 ? ' day' : ' days';
    } else if (countdown > 60) {
      display = Math.floor(countdown / 60).toString();
      display += Math.floor(countdown / 60) == 1 ? ' hour' : ' hours';
    } else {
      display = countdown.toString();
      display += (countdown == 1 || countdown == 0) ? ' minute' : ' minutes';
    }
    return display + ' ago';
  }

  getTotalUnSeen(id: string) {
    const result = this.messageList.find(i => i.senderId == id || i.recipientId == id)?.totalUnSeen;
    return result == undefined ? 0 : result;
  }

  openMessage(user: Employee) {
    this.messageService.createHubConnection(this.user, user.id!);
    this.recipient = { id: user.id!, name: user.fullName, photoUrl: user.avatar };
    this.isVisibleCurrentMessage = true;
  }

  closeMessage(){
    this.isVisibleCurrentMessage = false;
    this.messageService.stopHubConnection();
  }
}
