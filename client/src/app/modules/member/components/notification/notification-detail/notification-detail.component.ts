import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/interfaces/interfaceReponse';
import Quill from 'quill';
import { ImageHandler } from 'ngx-quill-upload';
import { FormBuilder, FormGroup } from '@angular/forms';
Quill.register('modules/imageHandler', ImageHandler);

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {
  notification!: Notification;
  form!: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
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

}
