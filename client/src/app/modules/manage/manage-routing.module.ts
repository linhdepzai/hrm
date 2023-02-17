import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../../layout/page-not-found/page-not-found.component';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { RolesComponent } from './components/admin/roles/roles.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { UsersComponent } from './components/admin/users/users.component';
import { WorkingTimeComponent } from './components/admin/working-time/working-time.component';
import { CheckinComponent } from './components/checkin/checkin.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestOffComponent } from './components/request-off/request-off.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'admin', component: AdminComponent, children: [
      {path: 'users', component: UsersComponent},
      {path: 'roles', component: RolesComponent},
      {path: 'working-time', component: WorkingTimeComponent},
    ]
  },
  { path: 'timesheet', component: TimesheetComponent },
  { path: 'checkin', component: CheckinComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'request-off', component: RequestOffComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
