import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoginResponse, TimeKeepingResponse, TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TimekeepingService } from '../../../services/timekeeping.service';
import { TimeworkingService } from '../../../services/timeworking.service';

@Component({
  selector: 'app-modal-list-checkin',
  templateUrl: './modal-list-checkin.component.html',
  styleUrls: ['./modal-list-checkin.component.css']
})
export class ModalListCheckinComponent implements OnInit {
  @Input() visibleModal = false;
  @Output() cancel = new EventEmitter();
  myTimeKeepingList: TimeKeepingResponse[] = [];
  myTimeWorking!: TimeWorkingResponse;
  monthList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearList: number[] = [];
  today = new Date();
  user!: LoginResponse;
  totalPunish: number = 0;
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  visibleComplain: boolean = false;
  idComplain = '';

  constructor(
    private timekeepingService: TimekeepingService,
    private timeworkingService: TimeworkingService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    for (let i = -10; i <= 10; i++) {
      this.yearList = [...this.yearList, this.today.getFullYear() + i];
    };
    this.timekeepingService.myTimeKeepingList$.subscribe((data) => {
      this.myTimeKeepingList = data;
      this.totalPunish = data.filter(i => i.punish == true).length;
    });
    this.timeworkingService.timeWorkingList$.subscribe((data) => {
      this.myTimeWorking = data.find(i => i.employeeId = this.user.id)!;
    })
  }

  filterYear(year: number) {
    this.timekeepingService.getTimeKeepingForUser(this.user.id, this.month, year);
    this.yearList = [];
    for (let i = -10; i <= 10; i++) {
      this.yearList = [...this.yearList, year + i];
    };
  }

  filterMonth(month: number) {
    this.timekeepingService.getTimeKeepingForUser(this.user.id, month, this.year);
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
      this.timekeepingService.complainDailyCheckin(payload);
      this.visibleComplain = false;
    } else {
      this.notification.error('Please input your complain!', '')
    };
  }

  handleCancel() {
    this.cancel.emit();
  }
}
