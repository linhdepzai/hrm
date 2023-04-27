import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { OnleaveService } from '../../../services/onleave.service';
import { OnLeaveResponse } from 'src/app/interfaces/interfaceReponse';
import { DatePipe } from '@angular/common';
import { Employee } from 'src/app/interfaces/interfaces';
import { EmployeeService } from '../../../services/employee.service';
import { DataService } from 'src/app/services/data.service';
import { Status } from 'src/app/enums/Enum';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-modal-timesheet',
  templateUrl: './modal-timesheet.component.html',
  styleUrls: ['./modal-timesheet.component.css']
})
export class ModalTimesheetComponent implements OnChanges {
  @Input() isVisibleModal: boolean = false;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Input() date!: Date;
  onleaveList: OnLeaveResponse[] = [];
  status = Status;

  constructor(
    private employeeService: EmployeeService,
    private dataService: DataService,
    private onLeaveService: OnleaveService,
    private datepipe: DatePipe,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.onLeaveService.onLeaveList$.subscribe((data) => {
      this.onleaveList = data.filter(i => this.datepipe.transform(i.dateLeave, 'dd/MM/yyyy') == this.datepipe.transform(this.date, 'dd/MM/yyyy'));
    });
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.onleaveList[event.previousIndex];
    this.onleaveList.splice(event.previousIndex, 1);
    this.onleaveList.splice(event.currentIndex, 0, item);
    this.onleaveList = [...this.onleaveList];
  }

  handleCancel() {
    this.cancel.emit();
  }

  getAccountName(id: string) {
    let employee!: string;
    this.employeeService.employeeList$
      .subscribe((data: Employee[]) => {
        employee = data.find(d => d.id == id)!.fullName;
      });
    return employee;
  }

  getOptionRequestOff(value: number) {
    let requestOff!: string;
    this.dataService.requestOffList
      .subscribe((data) => {
        requestOff = data.find(d => d.value == value)!.label;
      });
    return requestOff;
  }

  actionRequestOff(action: string, id: string){
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    const payload = {
      id: id,
      pmId: user.id,
      status: action == 'approve' ? Status.Approved : Status.Rejected
    }
    this.onLeaveService.updateStatusRequestOff(payload);
  }
}
