import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Level, Position, Priority, ProjectType, StatusTask } from 'src/app/enums/Enum';
import { DepartmentResponse, LoginResponse, OnLeaveResponse, ProjectResponse, TimeKeepingResponse, TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { CheckinOrCheckout, CreateProject, Department, Employee } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ManageService {
  public employeeList$ = new BehaviorSubject<Employee[]>([]);
  public departmentList$ = new BehaviorSubject<DepartmentResponse[]>([]);
  public onLeaveList$ = new BehaviorSubject<OnLeaveResponse[]>([]);
  public timeWorkingList$ = new BehaviorSubject<TimeWorkingResponse[]>([]);
  public projectList$ = new BehaviorSubject<ProjectResponse[]>([]);
  public myTimeKeepingList$ = new BehaviorSubject<TimeKeepingResponse[]>([]);
  public requestChangeInfoList$ = new BehaviorSubject<Employee[]>([]);
  public project$ = new BehaviorSubject<CreateProject>({
    id: null,
    projectName: '',
    description: '',
    projectType: ProjectType.FF,
    projectCode: '',
    deadlineDate: null,
    priorityCode: Priority.Medium,
    statusCode: StatusTask.Open,
    members: [],
  });
  public loading = new BehaviorSubject<boolean>(false);
  user: LoginResponse;
  constructor(
    private apiService: ApiService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private datepipe: DatePipe
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.getAllDepartment();
    this.getAllEmployee();
    this.getAllOnLeave();
    this.getAllTimeWorking();
    this.getAllProject();
    this.getTimeKeepingForUser(this.user.id, new Date().getMonth() + 1, new Date().getFullYear());
  }

  getAllDepartment() {
    this.apiService
      .getAllDepartment()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        this.loading.next(false);
        return of(err);
      }))
      .subscribe((response: DepartmentResponse[]) => {
        this.departmentList$.next(response);
      });
  }

  saveDepartment(payload: Department) {
    this.loading.next(true);
    this.apiService
      .saveDepartment(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        this.loading.next(false);
        return of(err);
      }))
      .subscribe((response) => {
        if (response.id) {
          this.notification.success('Successfully!', 'Department ' + response.name);
          if (payload.id) {
            this.departmentList$.value.splice(this.departmentList$.value.findIndex((item) => item.id === response.id), 1, response);
            this.departmentList$.next([...this.departmentList$.value]);
          } else {
            this.departmentList$.next([response, ...this.departmentList$.value]);
          };
        };
        this.loading.next(false);
      });
  }

  getAllEmployee() {
    this.apiService
      .getAllEmployee()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.employeeList$.next(response);
      });
  }

  saveEmployee(payload: Employee) {
    this.loading.next(true);
    this.apiService
      .saveEmployee(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        this.loading.next(false);
        return of(err);
      }))
      .subscribe((response) => {
        if (response.id) {
          this.notification.success('Successfully!', `Create ${Level[response.level]} ${Position[response.position]} ${response.fullName}`);
          if (payload.id) {
            this.employeeList$.value.splice(this.employeeList$.value.findIndex((item) => item.id === response.id), 1, response);
            this.employeeList$.next([...this.employeeList$.value]);
          } else {
            this.employeeList$.next([response, ...this.employeeList$.value]);
          };
        };
        this.loading.next(false);
      });
  }

  deleteEmployee(id: string) {
    this.loading.next(true);
    this.apiService
      .deleteEmployee(id)
      .subscribe(() => {
        const index = this.employeeList$.value.findIndex((item) => item.id == id);
        this.employeeList$.value.splice(index, 1);
        this.employeeList$.next([...this.employeeList$.value]);
        this.loading.next(false);
      });
  }

  requestOnLeave(form: any) {
    this.loading.next(true);
    this.apiService
      .requestOnLeave(form)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        this.loading.next(false);
        return of(err);
      }))
      .subscribe((response) => {
        this.getAllOnLeave();
        this.notification.success('Successfully!!!', `There are ${response.onLeave.length} items have been added!`);
        this.loading.next(false);
      });
  }

  getAllOnLeave() {
    this.apiService
      .getAllOnLeave()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response: OnLeaveResponse[]) => {
        this.onLeaveList$.next(response);
      });
  }

  deleteOnLeave(id: string) {
    this.loading.next(true);
    this.apiService
      .deleteOnLeave(id)
      .subscribe((response) => {
        if (response.length == 36) {
          const index = this.onLeaveList$.value.findIndex((item) => item.id == response);
          this.onLeaveList$.value.splice(index, 1);
          this.onLeaveList$.next([...this.onLeaveList$.value]);
          this.notification.success('Successfully!', 'This item has been deleted!');
        } else {
          this.notification.error('Error!!!', 'An error occurred during execution!');
        }
        this.loading.next(false);
      });
  }

  getAllTimeWorking() {
    this.apiService
      .getAllTimeWorking()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response: TimeWorkingResponse[]) => {
        const data = response.sort((a, b) => {
          return new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime();
        });
        this.timeWorkingList$.next(data);
      });
  }

  getAllProject() {
    this.apiService
      .getAllProject()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response: ProjectResponse[]) => {
        this.projectList$.next(response);
      });
  }

  getOnlyProject(projectId: string) {
    this.apiService
      .getOnlyProject(projectId)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        return of(err);
      }))
      .subscribe((response: CreateProject) => {
        this.project$.next(response);
        this.getAllEmployee();
      });

  }

  saveProject(payload: CreateProject) {
    this.loading.next(true);
    this.apiService
      .saveProject(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        this.loading.next(false);
        return of(err);
      }))
      .subscribe((response) => {
        if (response.id) {
          this.notification.success('Successfully!', 'This project has been created!');
        }
        this.loading.next(false);
      });
  }

  checkinOrCheckout(data: CheckinOrCheckout) {
    this.loading.next(true);
    this.apiService
      .checkinOrCheckout(data)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        this.loading.next(false);
        return of(err);
      }))
      .subscribe((response: TimeKeepingResponse) => {
        if (response) {
          this.myTimeKeepingList$.value.splice(this.myTimeKeepingList$.value.findIndex((item) => item.id === response.id), 1, response);
          this.myTimeKeepingList$.next([...this.myTimeKeepingList$.value]);
          const timeCheckin = this.datepipe.transform(response.checkin, 'HH:mm');
          this.notification.success('Checkin success!!!', 'You checkin at ' + timeCheckin);
        }
        this.loading.next(false);
      });
  }

  getTimeKeepingForUser(id: string, month: number, year: number) {
    this.apiService
      .getTimeKeepingForUser(id, month, year)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        return of(err);
      }))
      .subscribe((response: TimeKeepingResponse[]) => {
        const myTimeKeepingList = response.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.myTimeKeepingList$.next(myTimeKeepingList);
      });
  }

  requestChangeInfor(data: Employee) {
    this.apiService
      .requestChangeInfor(data)
      .subscribe((response) => {
        if (response.id) {
          this.notification.success('Request success!', '');
        }
      });
  }

  getAllRequestChangeInfo() {
    this.apiService
      .getAllRequestChangeInfo()
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        return of(err);
      }))
      .subscribe((response) => {
        this.requestChangeInfoList$.next(response);
      });
  }

  complainDailyCheckin(payload: { id: string, complain: string }) {
    this.apiService
      .complainDailyCheckin(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        return of(err);
      }))
      .subscribe((response) => {
        this.myTimeKeepingList$.value.splice(this.myTimeKeepingList$.value.findIndex((item) => item.id === response.id), 1, response);
        this.myTimeKeepingList$.next([...this.myTimeKeepingList$.value]);
      });
  }

  changePassword(payload: { id: string, password: string }) {
    this.apiService
      .changePassword(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        return of(err);
      }))
      .subscribe((response) => {
        if (response.id) {
          this.notification.success('Successfully!!!', 'You have successfully changed your password!');
        }
      });
  }
}
