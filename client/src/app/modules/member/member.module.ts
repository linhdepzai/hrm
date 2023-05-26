import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroSharedModule } from '../ng-zorro-shared/ng-zorro-shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ModalChangePasswordComponent } from './components/profile/modal-change-password/modal-change-password.component';
import { CheckinComponent } from './components/checkin/checkin.component';
import { RequestOffComponent } from './components/request-off/request-off.component';
import { ModalChangeInfoComponent } from './components/profile/modal-change-info/modal-change-info.component';
import { MyWorkingTimeComponent } from './components/my-working-time/my-working-time.component';
import { ModalRequestOffComponent } from './components/request-off/modal-request-off/modal-request-off.component';
import { ModalListCheckinComponent } from './components/checkin/modal-list-checkin/modal-list-checkin.component';
import { WebcamModule } from 'ngx-webcam';
import { TagComponent } from 'src/app/shared/components/tag/tag.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { MessageComponent } from './components/message/message.component';
import { MessageDetailComponent } from './components/message/message-detail/message-detail.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    CheckinComponent,
    RequestOffComponent,
    ModalChangeInfoComponent,
    MyWorkingTimeComponent,
    ModalRequestOffComponent,
    ModalListCheckinComponent,
    ModalChangePasswordComponent,
    MessageComponent,
    MessageDetailComponent,
    AvatarComponent,
  ],
  imports: [
    CommonModule,
    NgZorroSharedModule,
    WebcamModule,
    TagComponent,
  ],
  exports: [
    MemberRoutingModule,
    ModalChangePasswordComponent,
    AvatarComponent,
    MessageComponent,
    MessageDetailComponent,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
  ]
})
export class MemberModule { }
