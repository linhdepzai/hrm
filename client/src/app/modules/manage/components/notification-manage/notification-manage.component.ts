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
  notificationList = new Observable<Notification[]>();

  constructor(
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.notificationService.getAllNotification();
    this.notificationList = this.notificationService.notificationList$
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.notificationService.notificationList$.value[event.previousIndex];
    this.notificationService.notificationList$.value.splice(event.previousIndex, 1);
    this.notificationService.notificationList$.value.splice(event.currentIndex, 0, item);
    this.notificationService.notificationList$.next([...this.notificationService.notificationList$.value]);
  }

  handleDelete(id: string) {
    console.log(id);
  }
}
