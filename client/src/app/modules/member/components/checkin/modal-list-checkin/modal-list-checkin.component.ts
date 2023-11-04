import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoginResponse, TimeKeepingResponse, TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AccountService } from '../../../../../services/account.service';
import { Status } from 'src/app/enums/Enum';
import { DatePipe } from '@angular/common';
import { TimekeepingService } from 'src/app/services/timekeeping.service';

@Component({
  selector: 'app-modal-list-checkin',
  templateUrl: './modal-list-checkin.component.html',
  styleUrls: ['./modal-list-checkin.component.css']
})
export class ModalListCheckinComponent implements OnInit {
  @Input() visibleModal = false;
  @Output() cancel = new EventEmitter();
  myTimeKeepingList: TimeKeepingResponse[] = [];
  myTimeWorking: TimeWorkingResponse[] = [];
  monthList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearList: number[] = [];
  today = new Date();
  totalPunish: number = 0;
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  visibleComplain: boolean = false;
  idComplain = '';

  constructor(
    private timekeepingService: TimekeepingService,
    private accountService: AccountService,
    private notification: NzNotificationService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.accountService.getAllRequestChangeTimeWorkingForUser();
    for (let i = -10; i <= 10; i++) {
      this.yearList = [...this.yearList, this.today.getFullYear() + i];
    };
    this.timekeepingService.myTimeKeepingList$.subscribe((data) => {
      this.myTimeKeepingList = data;
      this.totalPunish = data.filter(i => i.punish == true).length;
    });
    this.accountService.requestTimeWorkingList$.subscribe((data) => {
      this.myTimeWorking = data.filter(i => i.status == Status.Approved).sort((a, b) => {
        return new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime();
      })!;
    })
  }

  filterYear(year: number) {
    this.timekeepingService.getTimeKeepingForUser(this.month, year);
    this.yearList = [];
    for (let i = -10; i <= 10; i++) {
      this.yearList = [...this.yearList, year + i];
    };
  }

  filterMonth(month: number) {
    this.timekeepingService.getTimeKeepingForUser(month, this.year);
  }

  openComplain(id: string | null) {
    this.visibleComplain = true;
    this.idComplain = id!;
  }

  handleComplain(id: string) {
    const complain = (<HTMLInputElement>document.getElementById('complain')).value;
    if (complain.trim() != '') {
      const payload = {
        id: id,
        complain: complain,
      };
      this.timekeepingService.complainDailyCheckin(payload)
        .subscribe((response) => {
          this.timekeepingService.myTimeKeepingList$.value.splice(this.timekeepingService.myTimeKeepingList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
          this.timekeepingService.myTimeKeepingList$.next([...this.timekeepingService.myTimeKeepingList$.value]);
        });
      this.visibleComplain = false;
    } else {
      this.notification.error('Please input your complain!', '')
    };
  }

  getTimeWorking(today: Date): TimeWorkingResponse {
    return this.myTimeWorking.find(i => new Date(this.datepipe.transform(i.applyDate, 'yyyy/MM/dd')!).getTime() <= new Date(this.datepipe.transform(today, 'yyyy/MM/dd')!).getTime())!;
  }

  handleCancel() {
    this.cancel.emit();
  }
}
