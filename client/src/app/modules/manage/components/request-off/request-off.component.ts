import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { OptionOnLeave, Status } from 'src/app/enums/Enum';
import { LoginResponse, OnLeaveResponse } from 'src/app/interfaces/interfaceReponse';
import { DataService } from 'src/app/services/data.service';
import { OnleaveService } from '../../services/onleave.service';

@Component({
  selector: 'app-request-off',
  templateUrl: './request-off.component.html',
  styleUrls: ['./request-off.component.css']
})
export class RequestOffComponent implements OnInit {
  date = new Date();
  requestList: { date: Date, option: OptionOnLeave, status: Status }[] = [];
  optionRequestList = new Observable<{ value: OptionOnLeave; label: string }[]>();
  onLeaveList: OnLeaveResponse[] = [];
  onLeaveListStorage: OnLeaveResponse[] = [];
  isVisibleModal: boolean = false;
  status = Status;
  confirmModal?: NzModalRef;
  optionOnLeave = OptionOnLeave;

  constructor(
    private onleaveService: OnleaveService,
    private dataService: DataService,
    private datepipe: DatePipe,
    private notification: NzNotificationService,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.requestList = [];
    this.optionRequestList = this.dataService.requestOffList;
    this.onleaveService.onLeaveList$.subscribe((data) => {
      this.onLeaveList = data.filter((item) => item.employeeId == user.id);
    });
  }

  getTotalRequestMonth(date: Date): { option: string, total: number }[] | null {
    const onLeaveListFilter = this.onLeaveList!.filter((item) =>
      date.getMonth() === new Date(item.dateLeave).getMonth() &&
      date.getFullYear() == new Date(item.dateLeave).getFullYear());
    if (onLeaveListFilter.length > 0) {
      const totalRequestOffMorning = onLeaveListFilter.filter((item) => item.option == OptionOnLeave.OffMorning).length;
      const totalRequestOffAfternoon = onLeaveListFilter.filter((item) => item.option == OptionOnLeave.OffAfternoon).length;
      const totalRequestOffFullDay = onLeaveListFilter.filter((item) => item.option == OptionOnLeave.OffFullDay).length;
      const totalRequestOffLate = onLeaveListFilter.filter((item) => item.option == OptionOnLeave.Late).length;
      return [
        { option: "off morning", total: totalRequestOffMorning },
        { option: "off afternoon", total: totalRequestOffAfternoon },
        { option: "off full day", total: totalRequestOffFullDay },
        { option: "late or leave early", total: totalRequestOffLate },
      ];
    }
    return null;
  }

  selectDateRequest(requestDate: Date) {
    let date = this.datepipe.transform(requestDate, 'MM/dd/yyyy')?.toString()!;
    let index = this.requestList.findIndex((item) => this.datepipe.transform(item.date, 'MM/dd/yyyy') == date);
    let onleaveDate = this.onLeaveList.find((item) => this.datepipe.transform(item.dateLeave, 'MM/dd/yyyy') == date);
    if (!onleaveDate) {
      if (requestDate.getTime() > this.date.getTime()) {
        if (index != -1) {
          this.requestList.splice(index, 1);
          this.requestList = [...this.requestList];
        } else {
          let newRequest = { date: new Date(date), option: OptionOnLeave.OffMorning, status: Status.New };
          this.requestList = [...this.requestList, newRequest];
        }
      } else {
        this.notification.error('You cannot request in past!!!', '');
      }
    }
  }

  changeOptionOnLeave(date: Date, option: OptionOnLeave, status: Status) {
    let data = { date: new Date(date), option: option, status: status };
    const onLeaveStorage = this.onLeaveListStorage.find(item => this.datepipe.transform(item.dateLeave, 'dd/MM/YYYY') === this.datepipe.transform(data.date, 'dd/MM/YYYY') && item.option == data.option);
    if (onLeaveStorage) {
      this.onLeaveList = [...this.onLeaveList, onLeaveStorage];
      const index = this.requestList.findIndex((item) => this.datepipe.transform(item.date, 'dd/MM/YYYY') === this.datepipe.transform(data.date, 'dd/MM/YYYY'));
      this.requestList.splice(index, 1);
      this.requestList = [...this.requestList];
      const indexOnLeaveListStorage = this.onLeaveListStorage.findIndex((item) => this.datepipe.transform(item.dateLeave, 'dd/MM/YYYY') === this.datepipe.transform(data.date, 'dd/MM/YYYY'));
      this.onLeaveListStorage.splice(indexOnLeaveListStorage, 1);
      this.onLeaveListStorage = [...this.onLeaveListStorage];
    } else {
      if (this.requestList.find(item => this.datepipe.transform(item.date, 'dd/MM/YYYY') === this.datepipe.transform(data.date, 'dd/MM/YYYY'))) {
        this.requestList.splice(this.requestList.findIndex((item) =>
          this.datepipe.transform(item.date, 'dd/MM/YYYY') === this.datepipe.transform(data.date, 'dd/MM/YYYY')
        ), 1, data);
        this.requestList = [...this.requestList];
      } else {
        const onLeave = this.onLeaveList.find((item) => this.datepipe.transform(item.dateLeave, 'dd/MM/YYYY') === this.datepipe.transform(data.date, 'dd/MM/YYYY'));
        const index = this.onLeaveList.findIndex((item) => this.datepipe.transform(item.dateLeave, 'dd/MM/YYYY') === this.datepipe.transform(data.date, 'dd/MM/YYYY'));
        this.onLeaveListStorage = [...this.onLeaveListStorage, onLeave!];
        this.onLeaveList.splice(index, 1);
        this.onLeaveList = [...this.onLeaveList];
        data.status = Status.New;
        this.requestList = [...this.requestList, data];
      }
    }
  }

  openModal() {
    this.isVisibleModal = true;
  }

  formatDate(date: Date) {
    return this.datepipe.transform(date, 'MM/dd/YYYY');
  }

  handleDelete(id: string, date: Date) {
    this.confirmModal = this.modal.confirm({
      nzTitle: `Delete request in ${this.datepipe.transform(date, 'dd/MM/YYYY')}?`,
      nzOnOk: () =>
        new Promise((resolve) => {
          this.onleaveService.deleteOnLeave(id);
          setTimeout(resolve, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }

  requestSubmit() {
    this.requestList = [];
    this.isVisibleModal = false;
  }

  disableDate(date: Date) {
    const today = new Date();
    if (new Date(date) < today && Number(this.datepipe.transform(date, 'dd')) < Number(this.datepipe.transform(today, 'dd'))) {
      return true;
    } else {
      return false;
    }
  }
}
