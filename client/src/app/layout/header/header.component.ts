import { Component, OnInit } from '@angular/core';
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

  constructor(
    private notificationService: NotificationService,
  ){}

  ngOnInit(): void {
    this.notificationService.getAllNotification();
    this.totalUnreadNoti = this.notificationService.notificationList$.value.filter(i => i.isRead == false).length;
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
