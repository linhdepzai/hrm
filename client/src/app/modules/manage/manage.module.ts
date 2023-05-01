import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ManageRoutingModule } from './manage-routing.module';
import { registerLocaleData } from '@angular/common';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { AdminComponent } from './components/admin/admin.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { UsersComponent } from './components/admin/users/users.component';
import { WorkingTimeComponent } from './components/admin/working-time/working-time.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CheckinComponent } from './components/checkin/checkin.component';
import { WebcamModule } from 'ngx-webcam';
import { RequestOffComponent } from './components/request-off/request-off.component';
import { CreateOrEditEmployeeComponent } from './components/admin/users/create-or-edit-employee/create-or-edit-employee.component';
import { CreateDepartmentModalComponent } from './components/admin/users/create-or-edit-employee/create-department-modal/create-department-modal.component';
import { TagComponent } from "../../shared/components/tag/tag.component";
import { ModalChangeInfoComponent } from './components/profile/modal-change-info/modal-change-info.component';
import { ModalWorkingTimeComponent } from './components/admin/working-time/modal-working-time/modal-working-time.component';
import { MyWorkingTimeComponent } from './components/my-working-time/my-working-time.component';
import { ProjectComponent } from './components/project/project.component';
import { TaskComponent } from './components/task/task.component';
import { ModalRequestOffComponent } from './components/request-off/modal-request-off/modal-request-off.component';
import { CreateOrEditProjectComponent } from './components/project/create-or-edit-project/create-or-edit-project.component';
import { GeneralProjectComponent } from './components/project/create-or-edit-project/general-project/general-project.component';
import { TeamProjectComponent } from './components/project/create-or-edit-project/team-project/team-project.component';
import { ModalListCheckinComponent } from './components/checkin/modal-list-checkin/modal-list-checkin.component';
import { ModalChangePasswordComponent } from './components/profile/modal-change-password/modal-change-password.component';
import { NgZorroSharedModule } from '../ng-zorro-shared/ng-zorro-shared.module';
import { ModalTimesheetComponent } from './components/timesheet/modal-timesheet/modal-timesheet.component';
import { EvaluateComponent } from './components/admin/evaluate/evaluate.component';
import { EditEvaluateComponent } from './components/admin/evaluate/edit-evaluate/edit-evaluate.component';
registerLocaleData(en);
@NgModule({
    declarations: [
        HomeComponent,
        AdminComponent,
        TimesheetComponent,
        UsersComponent,
        WorkingTimeComponent,
        ProfileComponent,
        CheckinComponent,
        RequestOffComponent,
        CreateOrEditEmployeeComponent,
        CreateDepartmentModalComponent,
        ModalChangeInfoComponent,
        ModalWorkingTimeComponent,
        MyWorkingTimeComponent,
        ProjectComponent,
        TaskComponent,
        ModalRequestOffComponent,
        CreateOrEditProjectComponent,
        GeneralProjectComponent,
        TeamProjectComponent,
        ModalListCheckinComponent,
        ModalChangePasswordComponent,
        ModalTimesheetComponent,
        EvaluateComponent,
        EditEvaluateComponent,
    ],
    exports: [
        ManageRoutingModule,
        ModalChangePasswordComponent,
    ],
    providers: [
        DatePipe,
        { provide: NZ_I18N, useValue: en_US },
    ],
    imports: [
        CommonModule,
        NgZorroSharedModule,
        ManageRoutingModule,
        WebcamModule,
        TagComponent,
    ]
})
export class ManageModule { }
