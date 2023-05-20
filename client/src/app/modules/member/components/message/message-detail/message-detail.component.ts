import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from 'src/app/interfaces/interfaceReponse';
import { Message } from 'src/app/interfaces/interfaces';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})
export class MessageDetailComponent implements OnInit {
  @Input() recipient!: { id: string, name: string, photoUrl: string };
  messages: any;
  messageThreadSource: Message[] = [];
  user!: LoginResponse;
  recipientName: string = '';

  constructor(
    protected messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    window.scrollTo(0, document.body.scrollHeight);
    // this.messageService.messageSource.subscribe((data) => {
    //   this.messageThreadSource = data;
    //   this.recipientName = this.recipient.name;
    // });
  }

  onChat(ev: any) {
    if (ev.key === 'Enter' && ev.target.value) {
      const payload = {
        senderId: this.user.id,
        recipientId: this.recipient.id,
        content: (<HTMLInputElement>document.getElementById('chat')).value,
      };
      this.messageService
        .sendMessage(payload)
        .then(() => {
          // this.messageService.messageSource.next([...this.messageService.messageSource.value, response.data]);
          (<HTMLInputElement>document.getElementById('chat')).value = '';
        });
    }
  }
}
