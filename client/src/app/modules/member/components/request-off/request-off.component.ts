import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { OptionRequestOff, Status } from 'src/app/enums/Enum';
import { RequestOffResponse } from 'src/app/interfaces/interfaceReponse';
import { DataService } from 'src/app/services/data.service';
import { RequestOffService } from 'src/app/services/requestoff.service';

@Component({
  selector: 'app-request-off',
  templateUrl: './request-off.component.html',
  styleUrls: ['./request-off.component.css']
})
export class RequestOffComponent implements OnInit {
  date = new Date();
  requestList: { dayOff: Date, option: OptionRequestOff, status: Status }[] = [];
  optionRequestList = new Observable<{ value: OptionRequestOff; label: string }[]>();
  requestOffList: RequestOffResponse[] = [];
  requestOffListStorage: RequestOffResponse[] = [];
  isVisibleModal: boolean = false;
  status = Status;
  confirmModal?: NzModalRef;
  optionRequestOff = OptionRequestOff;

  constructor(
    private requestOffService: RequestOffService,
    private dataService: DataService,
    private datepipe: DatePipe,
    private notification: NzNotificationService,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
    this.requestOffService.getAllCurrentOff();
    this.requestList = [];
    this.optionRequestList = this.dataService.requestOffList;
    this.requestOffService.currRequestOff$.subscribe((data) => {
      this.requestOffList = data;
    });
  }

  getTotalRequestMonth(date: Date): { option: string, total: number }[] | null {
    const requestOffListFilter = this.requestOffList!.filter((item) =>
      date.getMonth() === new Date(item.dayOff).getMonth() &&
      date.getFullYear() == new Date(item.dayOff).getFullYear());
    if (requestOffListFilter.length > 0) {
      const totalRequestOffMorning = requestOffListFilter.filter((item) => item.option == OptionRequestOff.OffMorning).length;
      const totalRequestOffAfternoon = requestOffListFilter.filter((item) => item.option == OptionRequestOff.OffAfternoon).length;
      const totalRequestOffFullDay = requestOffListFilter.filter((item) => item.option == OptionRequestOff.OffFullDay).length;
      const totalRequestOffLate = requestOffListFilter.filter((item) => item.option == OptionRequestOff.Late).length;
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
    let index = this.requestList.findIndex((item) => this.datepipe.transform(item.dayOff, 'MM/dd/yyyy') == date);
    let onleaveDate = this.requestOffList.find((item) => this.datepipe.transform(item.dayOff, 'MM/dd/yyyy') == date);
    if (!onleaveDate) {
      if (requestDate.getTime() > this.date.getTime()) {
        if (index != -1) {
          this.requestList.splice(index, 1);
          this.requestList = [...this.requestList];
        } else {
          let newRequest = { dayOff: new Date(date), option: OptionRequestOff.OffMorning, status: Status.New };
          this.requestList = [...this.requestList, newRequest];
        }
      } else {
        this.notification.error('You cannot request in past!!!', '');
      }
    }
  }

  changeOptionRequestOff(dayOff: Date, option: OptionRequestOff, status: Status) {
    let data = { dayOff: new Date(dayOff), option: option, status: status };
    const requestOffStorage = this.requestOffListStorage.find(item => this.datepipe.transform(item.dayOff, 'dd/MM/YYYY') === this.datepipe.transform(data.dayOff, 'dd/MM/YYYY') && item.option == data.option);
    if (requestOffStorage) {
      this.requestOffList = [...this.requestOffList, requestOffStorage];
      const index = this.requestList.findIndex((item) => this.datepipe.transform(item.dayOff, 'dd/MM/YYYY') === this.datepipe.transform(data.dayOff, 'dd/MM/YYYY'));
      this.requestList.splice(index, 1);
      this.requestList = [...this.requestList];
      const indexRequestOffListStorage = this.requestOffListStorage.findIndex((item) => this.datepipe.transform(item.dayOff, 'dd/MM/YYYY') === this.datepipe.transform(data.dayOff, 'dd/MM/YYYY'));
      this.requestOffListStorage.splice(indexRequestOffListStorage, 1);
      this.requestOffListStorage = [...this.requestOffListStorage];
    } else {
      if (this.requestList.find(item => this.datepipe.transform(item.dayOff, 'dd/MM/YYYY') === this.datepipe.transform(data.dayOff, 'dd/MM/YYYY'))) {
        this.requestList.splice(this.requestList.findIndex((item) =>
          this.datepipe.transform(item.dayOff, 'dd/MM/YYYY') === this.datepipe.transform(data.dayOff, 'dd/MM/YYYY')
        ), 1, data);
        this.requestList = [...this.requestList];
      } else {
        const requestOff = this.requestOffList.find((item) => this.datepipe.transform(item.dayOff, 'dd/MM/YYYY') === this.datepipe.transform(data.dayOff, 'dd/MM/YYYY'));
        const index = this.requestOffList.findIndex((item) => this.datepipe.transform(item.dayOff, 'dd/MM/YYYY') === this.datepipe.transform(data.dayOff, 'dd/MM/YYYY'));
        this.requestOffListStorage = [...this.requestOffListStorage, requestOff!];
        this.requestOffList.splice(index, 1);
        this.requestOffList = [...this.requestOffList];
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
          this.requestOffService.deleteRequestOff(id)
            .subscribe((response) => {
              if (response.statusCode == 200) {
                const index = this.requestOffService.currRequestOff$.value.findIndex((item) => item.id == response.data.id);
                this.requestOffService.currRequestOff$.value.splice(index, 1);
                this.requestOffService.currRequestOff$.next([...this.requestOffService.currRequestOff$.value]);
                this.notification.success('Successfully!', response.message);
              }
            });
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
