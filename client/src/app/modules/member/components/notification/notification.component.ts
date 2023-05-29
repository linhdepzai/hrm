import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/interfaces/interfaceReponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notificationList = new Observable<Notification[]>();
  noResult: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.notificationList = this.notificationService.notificationList$;
    if(this.notificationService.notificationList$.value.length == 0) this.noResult = true;
  }

  readNotification(id: string) {
    this.router.navigate(['member/notification-detail/' + id]);
  }

}
