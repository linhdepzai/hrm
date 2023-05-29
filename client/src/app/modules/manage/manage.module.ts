import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ManageRoutingModule } from './manage-routing.module';
import { registerLocaleData } from '@angular/common';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { WebcamModule } from 'ngx-webcam';
import { TagComponent } from "../../shared/components/tag/tag.component";
import { ProjectComponent } from './components/project/project.component';
import { TaskComponent } from './components/task/task.component';
import { CreateOrEditProjectComponent } from './components/project/create-or-edit-project/create-or-edit-project.component';
import { GeneralProjectComponent } from './components/project/create-or-edit-project/general-project/general-project.component';
import { TeamProjectComponent } from './components/project/create-or-edit-project/team-project/team-project.component';
import { NgZorroSharedModule } from '../ng-zorro-shared/ng-zorro-shared.module';
import { ModalTimesheetComponent } from './components/timesheet/modal-timesheet/modal-timesheet.component';
import { PayoffComponent } from './components/payoff/payoff.component';
import { ModalPayoffComponent } from './components/payoff/modal-payoff/modal-payoff.component';
import { SalaryComponent } from './components/salary/salary.component';
import { ModalSalaryComponent } from './components/salary/modal-salary/modal-salary.component';
import { SalaryForEmployeeComponent } from './components/salary-for-employee/salary-for-employee.component';
import { ModalSalaryForEmployeeComponent } from './components/salary-for-employee/modal-salary-for-employee/modal-salary-for-employee.component';
import { UsersComponent } from './components/users/users.component';
import { WorkingTimeComponent } from './components/working-time/working-time.component';
import { CreateOrEditEmployeeComponent } from './components/users/create-or-edit-employee/create-or-edit-employee.component';
import { CreateDepartmentModalComponent } from './components/users/create-or-edit-employee/create-department-modal/create-department-modal.component';
import { ModalWorkingTimeComponent } from './components/working-time/modal-working-time/modal-working-time.component';
import { EditEvaluateComponent } from './components/evaluate/edit-evaluate/edit-evaluate.component';
import { EvaluateComponent } from './components/evaluate/evaluate.component';
import { NotificationManageComponent } from './components/notification-manage/notification-manage.component';
import { QuillModule } from 'ngx-quill';
import { CreateOrEditNotificationComponent } from './components/notification-manage/create-or-edit-notification/create-or-edit-notification.component';
registerLocaleData(en);
@NgModule({
    declarations: [
        TimesheetComponent,
        UsersComponent,
        WorkingTimeComponent,
        CreateOrEditEmployeeComponent,
        CreateDepartmentModalComponent,
        ModalWorkingTimeComponent,
        ProjectComponent,
        TaskComponent,
        CreateOrEditProjectComponent,
        GeneralProjectComponent,
        TeamProjectComponent,
        ModalTimesheetComponent,
        EvaluateComponent,
        EditEvaluateComponent,
        PayoffComponent,
        ModalPayoffComponent,
        SalaryComponent,
        ModalSalaryComponent,
        SalaryForEmployeeComponent,
        ModalSalaryForEmployeeComponent,
        NotificationManageComponent,
        CreateOrEditNotificationComponent,
    ],
    exports: [
        ManageRoutingModule,
    ],
    providers: [
        DatePipe,
        { provide: NZ_I18N, useValue: en_US },
    ],
    imports: [
        CommonModule,
        NgZorroSharedModule,
        ManageRoutingModule,
        TagComponent,
        QuillModule.forRoot(),
    ]
})
export class ManageModule { }
