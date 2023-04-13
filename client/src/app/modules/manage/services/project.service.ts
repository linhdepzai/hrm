import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Priority, ProjectType, StatusTask } from 'src/app/enums/Enum';
import { ProjectResponse } from 'src/app/interfaces/interfaceReponse';
import { CreateProject } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { EmployeeService } from './employee.service';

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
    private apiService: ApiService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private employeeService: EmployeeService,
  ) { 
    this.getAllProject();
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
        this.employeeService.getAllEmployee();
      });

  }

  saveProject(payload: CreateProject) {
    this.apiService
      .saveProject(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        return of(err);
      }))
      .subscribe((response) => {
        if (response.id) {
          this.notification.success('Successfully!', 'This project has been created!');
        }
      });
  }
}
