import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Level, Position } from 'src/app/enums/Enum';
import { Employee } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  public employeeList$ = new BehaviorSubject<Employee[]>([]);

  constructor(
    private apiService: ApiService,
    private notification: NzNotificationService,
    private message: NzMessageService,
  ) { 
    this.getAllEmployee();
  }

  getAllEmployee() {
    this.apiService
      .getAllEmployee()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.employeeList$.next(response.data as Employee[]);
      });
  }

  saveEmployee(payload: Employee) {
    this.apiService
      .saveEmployee(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Successfully!', `Create ${Level[response.data.level]} ${Position[response.data.position]} ${response.data.fullName}`);
          if (payload.id) {
            this.employeeList$.value.splice(this.employeeList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
            this.employeeList$.next([...this.employeeList$.value]);
          } else {
            this.employeeList$.next([response.data, ...this.employeeList$.value]);
          };
        };
      });
  }

  deleteEmployee(id: string) {
    this.apiService
      .deleteEmployee(id)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', err.error.message);
        return of(err);
      }))
      .subscribe((response) => {
        const index = this.employeeList$.value.findIndex((item) => item.id == id);
        this.employeeList$.value.splice(index, 1);
        this.employeeList$.next([...this.employeeList$.value]);
        this.notification.success('Successfully!!!', response.message);
      });
  }
}
