import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject } from 'rxjs';
import { OnLeaveResponse } from 'src/app/interfaces/interfaceReponse';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OnleaveService {
  public onLeaveList$ = new BehaviorSubject<OnLeaveResponse[]>([]);

  constructor(
    private apiService: ApiService,
    private notification: NzNotificationService,
  ) {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.getAllOnLeave(user.id);
  }

  requestOnLeave(form: any) {
    this.apiService
      .requestOnLeave(form)
      .subscribe((response) => {
        this.getAllOnLeave(form.employeeId);
        this.notification.success('Successfully!!!', `There are ${response.data.onLeave.length} items have been added!`);
      });
  }

  getAllOnLeave(id: string) {
    this.apiService
      .getAllOnLeave(id)
      .subscribe((response) => {
        this.onLeaveList$.next(response.data);
      });
  }

  deleteOnLeave(id: string) {
    this.apiService
      .deleteOnLeave(id)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          const index = this.onLeaveList$.value.findIndex((item) => item.id == response.data.id);
          this.onLeaveList$.value.splice(index, 1);
          this.onLeaveList$.next([...this.onLeaveList$.value]);
          this.notification.success('Successfully!', response.message);
        }
      });
  }

  updateStatusRequestOff(payload: { id: string; pmId: string; status: number; }) {
    this.apiService
      .updateStatusRequestOff(payload)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.onLeaveList$.value.splice(this.onLeaveList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
          this.onLeaveList$.next([...this.onLeaveList$.value]);
          this.notification.success('Successfully!', response.message);
        }
      });
  }
}
