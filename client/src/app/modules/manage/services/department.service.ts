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
      .subscribe((response) => {
        this.departmentList$.next(response.data as DepartmentResponse[]);
      });
  }

  saveDepartment(payload: Department) {
    this.apiService
      .saveDepartment(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Successfully!', 'Department ' + response.data.name);
          if (payload.id) {
            this.departmentList$.value.splice(this.departmentList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
            this.departmentList$.next([...this.departmentList$.value]);
          } else {
            this.departmentList$.next([response.data, ...this.departmentList$.value]);
          };
        };
      });
  }
}
