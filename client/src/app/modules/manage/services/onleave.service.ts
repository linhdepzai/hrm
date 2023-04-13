import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, catchError, of } from 'rxjs';
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
    private message: NzMessageService,
    ) { 
      this.getAllOnLeave();
    }

  requestOnLeave(form: any) {
    this.apiService
      .requestOnLeave(form)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        return of(err);
      }))
      .subscribe((response) => {
        this.getAllOnLeave();
        this.notification.success('Successfully!!!', `There are ${response.onLeave.length} items have been added!`);
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
      });
  }
}
