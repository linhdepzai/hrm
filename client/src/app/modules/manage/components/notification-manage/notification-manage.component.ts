import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/interfaces/interfaceReponse';
import { NotificationService } from 'src/app/services/notification.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-manage',
  templateUrl: './notification-manage.component.html',
  styleUrls: ['./notification-manage.component.css']
})
export class NotificationManageComponent implements OnInit {
  notificationList: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.notificationService.getAllNotificationForAccountant()
    .subscribe((response) => {
      const result = (response.data as Notification[]).sort((a,b) => {
        return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
      });
      this.notificationList = result;
    });
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.notificationList[event.previousIndex];
    this.notificationList.splice(event.previousIndex, 1);
    this.notificationList.splice(event.currentIndex, 0, item);
    this.notificationList = [...this.notificationList];
  }

  handleDelete(id: string) {
    console.log(id);
  }
}
