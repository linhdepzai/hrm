import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/interfaces/interfaceReponse';
import Quill from 'quill';
import { ImageHandler } from 'ngx-quill-upload';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Level } from 'src/app/enums/Enum';
import { SalaryService } from 'src/app/services/salary.service';
import { PositionService } from 'src/app/services/position.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
Quill.register('modules/imageHandler', ImageHandler);

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {
  notification!: Notification;
  form!: FormGroup;
  level = Level;

  constructor(
    private notificationService: NotificationService,
    private salaryService: SalaryService,
    private positionService: PositionService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private noti: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.notificationService.readNotification(params['id'])
        .subscribe((response) => {
          this.notification = response.data[0];
          this.form = this.fb.group({ content: [null] });
          this.form.patchValue(this.notification);
        });
    });
  }

  getPositionName(id: number) {
    return this.positionService.positionList$.value.find(i => i.id == id)?.name;
  }

  confirmSalary(id: string, action: number){
    this.salaryService.confirmSalary(id, action)
      .subscribe((response) => {
        if (response.data.IsConfirm == 1) {
          this.noti.success('Inbox with the accountant to solve the problem!','');
        } else {
          this.noti.success('Successfully','');
          this.location.back();
        }
      })
  }
}
