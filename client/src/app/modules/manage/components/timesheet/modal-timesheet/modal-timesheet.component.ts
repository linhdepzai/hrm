import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Employee } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import { Status } from 'src/app/enums/Enum';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmployeeService } from 'src/app/services/employee.service';
import { RequestOffResponse } from 'src/app/interfaces/interfaceReponse';
import { RequestOffService } from 'src/app/services/requestoff.service';

@Component({
  selector: 'app-modal-timesheet',
  templateUrl: './modal-timesheet.component.html',
  styleUrls: ['./modal-timesheet.component.css']
})
export class ModalTimesheetComponent implements OnChanges {
  @Input() isVisibleModal: boolean = false;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Input() date!: Date;
  requestOffList: RequestOffResponse[] = [];
  status = Status;
  role = JSON.parse(localStorage.getItem('role')!);

  constructor(
    private employeeService: EmployeeService,
    private requestOffService: RequestOffService,
    private dataService: DataService,
    private datepipe: DatePipe,
    private notification: NzNotificationService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.requestOffService.requestOffList$.subscribe((data) => {
      this.requestOffList = data.filter(i => this.datepipe.transform(i.dayOff, 'dd/MM/yyyy') == this.datepipe.transform(this.date, 'dd/MM/yyyy'));
    });
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.requestOffList[event.previousIndex];
    this.requestOffList.splice(event.previousIndex, 1);
    this.requestOffList.splice(event.currentIndex, 0, item);
    this.requestOffList = [...this.requestOffList];
  }

  handleCancel() {
    this.cancel.emit();
  }

  getOptionRequestOff(value: number) {
    return this.dataService.requestOffList.value.find(d => d.value == value)!.label;
  }

  actionRequestOff(action: string, id: string) {
    const payload = {
      id: id,
      status: action == 'approve' ? Status.Approved : Status.Rejected
    }
    this.requestOffService.updateStatusRequestOff(payload)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.requestOffService.requestOffList$.value.splice(this.requestOffService.requestOffList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
          this.requestOffService.requestOffList$.next([...this.requestOffService.requestOffList$.value]);
          this.notification.success('Successfully!', response.message);
        }
      });
  }
}
