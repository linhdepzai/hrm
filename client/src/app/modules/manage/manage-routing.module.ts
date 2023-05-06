import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../../layout/page-not-found/page-not-found.component';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { UsersComponent } from './components/admin/users/users.component';
import { WorkingTimeComponent } from './components/admin/working-time/working-time.component';
import { CheckinComponent } from './components/checkin/checkin.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestOffComponent } from './components/request-off/request-off.component';
import { MyWorkingTimeComponent } from './components/my-working-time/my-working-time.component';
import { ProjectComponent } from './components/project/project.component';
import { TaskComponent } from './components/task/task.component';
import { EvaluateComponent } from './components/admin/evaluate/evaluate.component';
import { PayoffComponent } from './components/payoff/payoff.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'admin', component: AdminComponent, children: [
      {path: 'users', component: UsersComponent},
      {path: 'working-time', component: WorkingTimeComponent},
      {path: 'evaluate', component: EvaluateComponent},
      {path: 'punish', component: PayoffComponent},
    ]
  },
  { path: 'timesheet', component: TimesheetComponent },
  { path: 'checkin', component: CheckinComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'request-off', component: RequestOffComponent },
  { path: 'my-working-time', component: MyWorkingTimeComponent },
  { path: 'project', component: ProjectComponent },
  { path: 'task', component: TaskComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
