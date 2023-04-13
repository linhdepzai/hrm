import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { DepartmentResponse } from 'src/app/interfaces/interfaceReponse';
import { Department } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  public departmentList$ = new BehaviorSubject<DepartmentResponse[]>([]);

  constructor(
    private apiService: ApiService,
    private notification: NzNotificationService,
    private message: NzMessageService,
  ) { 
    this.getAllDepartment();
  }

  getAllDepartment() {
    this.apiService
      .getAllDepartment()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response: DepartmentResponse[]) => {
        this.departmentList$.next(response);
      });
  }

  saveDepartment(payload: Department) {
    this.apiService
      .saveDepartment(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
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
      });
  }
}
