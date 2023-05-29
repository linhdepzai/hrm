import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../../layout/page-not-found/page-not-found.component';
import { PayoffComponent } from './components/payoff/payoff.component';
import { SalaryComponent } from './components/salary/salary.component';
import { SalaryForEmployeeComponent } from './components/salary-for-employee/salary-for-employee.component';
import { UsersComponent } from './components/users/users.component';
import { WorkingTimeComponent } from './components/working-time/working-time.component';
import { EvaluateComponent } from './components/evaluate/evaluate.component';
import { NotificationManageComponent } from './components/notification-manage/notification-manage.component';
import { CreateOrEditNotificationComponent } from './components/notification-manage/create-or-edit-notification/create-or-edit-notification.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'working-time', component: WorkingTimeComponent },
  { path: 'evaluate', component: EvaluateComponent },
  { path: 'punish', component: PayoffComponent },
  { path: 'salary-management', component: SalaryComponent },
  { path: 'salary-for-employee', component: SalaryForEmployeeComponent },
  { path: 'notification', component: NotificationManageComponent },
  { path: 'notification/:id', component: CreateOrEditNotificationComponent },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
