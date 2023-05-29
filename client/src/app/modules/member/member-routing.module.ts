import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TimesheetComponent } from '../manage/components/timesheet/timesheet.component';
import { CheckinComponent } from './components/checkin/checkin.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestOffComponent } from './components/request-off/request-off.component';
import { MyWorkingTimeComponent } from './components/my-working-time/my-working-time.component';
import { ProjectComponent } from '../manage/components/project/project.component';
import { TaskComponent } from '../manage/components/task/task.component';
import { NotificationDetailComponent } from './components/notification/notification-detail/notification-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'timesheet', component: TimesheetComponent },
  { path: 'checkin', component: CheckinComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'request-off', component: RequestOffComponent },
  { path: 'my-working-time', component: MyWorkingTimeComponent },
  { path: 'project', component: ProjectComponent },
  { path: 'task', component: TaskComponent },
  { path: 'notification-detail/:id', component: NotificationDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
