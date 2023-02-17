import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ManageRoutingModule } from './manage-routing.module';
import { registerLocaleData } from '@angular/common';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { AdminComponent } from './components/admin/admin.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { RolesComponent } from './components/admin/roles/roles.component';
import { UsersComponent } from './components/admin/users/users.component';
import { WorkingTimeComponent } from './components/admin/working-time/working-time.component';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { FormsModule } from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { ProfileComponent } from './components/profile/profile.component';
import { CheckinComponent } from './components/checkin/checkin.component';
import { WebcamModule } from 'ngx-webcam';
import { NzButtonModule } from 'ng-zorro-antd/button';
registerLocaleData(en);

@NgModule({
  declarations: [
    HomeComponent,
    AdminComponent,
    TimesheetComponent,
    RolesComponent,
    UsersComponent,
    WorkingTimeComponent,
    ProfileComponent,
    CheckinComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzBadgeModule,
    NzCalendarModule,
    WebcamModule,
    NzButtonModule
  ],
  exports: [
    ManageRoutingModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
  ]
})
export class ManageModule { }
