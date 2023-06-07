import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/interfaces/interfaces';
import { MessageService } from 'src/app/services/message.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  visibleSidebar = false;
  visibleSetting = false;
  visibleMessage = false;
  isVisibleModalChangePassword = false;
  isVisibleModalChangeAvatar = false;
  totalUnreadNoti: number = 0;
  totalUnSeen: number = 0;

  constructor(
    private notificationService: NotificationService,
    private messageService: MessageService,
  ){}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.notificationService.getAllNotification();
    this.notificationService.notificationList$.subscribe((data) => {
      this.totalUnreadNoti = data.filter(i => i.isRead == false).length;
    });
    this.messageService.getMessages().subscribe((response) => {
      (response.data as Message[]).forEach((item) => { this.totalUnSeen += item.totalUnSeen });
    });
  }

  openSidebar(): void {
    this.visibleSidebar = true;
  }

  closeSidebar(): void {
    this.visibleSidebar = false;
  }

  openSetting(): void {
    this.visibleSetting = true;
  }

  closeSetting(): void {
    this.visibleSetting = false;
  }

  openModalChangePassword(): void {
    this.isVisibleModalChangePassword = true;
  }

  closeModalChangePassword(): void {
    this.isVisibleModalChangePassword = false;
  }

  openMessage(): void {
    this.visibleMessage = true;
  }

  closeMessage(): void {
    this.visibleMessage = false;
  }

  openModalChangeAvatar(): void {
    this.isVisibleModalChangeAvatar = true;
  }

  closeModalChangeAvatar(): void {
    this.isVisibleModalChangeAvatar = false;
  }
}
