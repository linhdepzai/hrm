import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/interfaces/interfaceReponse';
import { NotificationService } from 'src/app/services/notification.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-notification-manage',
  templateUrl: './notification-manage.component.html',
  styleUrls: ['./notification-manage.component.css']
})
export class NotificationManageComponent implements OnInit {
  notificationList: Notification[] = [];
  confirmModal?: NzModalRef;

  constructor(
    private notificationService: NotificationService,
    private modal: NzModalService,
    private notification: NzNotificationService,
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
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this movie?',
      nzContent: 'When clicked the OK button, this movie will be deleted system-wide!!!',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.notificationService.deleteNotification(id).subscribe((response) => {
            if (response.message == 'Removed') {
              const index = this.notificationList.findIndex((item) => item.id == id);
              this.notificationList.splice(index, 1);
              this.notificationList = [...this.notificationList];
            } else {
              this.notification.create('error', 'Failed!', '');
            }
          });
          setTimeout(null ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
