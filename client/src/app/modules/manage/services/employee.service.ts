import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject } from 'rxjs';
import { Level, Position } from 'src/app/enums/Enum';
import { Employee } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  public employeeList$ = new BehaviorSubject<Employee[]>([]);
  public requestChangeInfoList$ = new BehaviorSubject<Employee[]>([]);

  constructor(
    private apiService: ApiService,
    private notification: NzNotificationService,
  ) { 
    this.getAllEmployee();
  }

  getAllEmployee() {
    this.apiService
      .getAllEmployee()
      .subscribe((response) => {
        this.employeeList$.next(response.data);
      });
  }

  saveEmployee(payload: Employee) {
    this.apiService
      .saveEmployee(payload)
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
      .subscribe((response) => {
        const index = this.employeeList$.value.findIndex((item) => item.id == id);
        this.employeeList$.value.splice(index, 1);
        this.employeeList$.next([...this.employeeList$.value]);
        this.notification.success('Successfully!!!', response.message);
      });
  }

  getAllRequestChangeInfo() {
    this.apiService
      .getAllRequestChangeInfo()
      .subscribe((response) => {
        this.requestChangeInfoList$.next(response.data);
      });
  }
}
