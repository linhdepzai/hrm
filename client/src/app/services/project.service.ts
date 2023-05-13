import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { Priority, ProjectType, StatusTask } from 'src/app/enums/Enum';
import { ApiResponse, ProjectResponse } from 'src/app/interfaces/interfaceReponse';
import { CreateProject } from 'src/app/interfaces/interfaces';
import { EmployeeService } from './employee.service';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public projectList$ = new BehaviorSubject<ProjectResponse[]>([]);
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
  
  constructor(
    private notification: NzNotificationService,
    private employeeService: EmployeeService,
    private httpClient: HttpClient,
    private message: NzMessageService,
  ) { }

  getAllProject() {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'project/getall')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.projectList$.next(response.data);
      });
  }

  getOnlyProject(projectId: string) {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'project/getAProject?projectId=' + projectId)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        this.project$.next(response.data);
        this.employeeService.getAllEmployee();
      });
  }

  saveProject(payload: CreateProject): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.baseUrl + 'project/save', payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }));
  }
}
