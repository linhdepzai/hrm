import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RequestOffResponse } from 'src/app/interfaces/interfaceReponse';
import { Employee } from 'src/app/interfaces/interfaces';
import { EmployeeService } from 'src/app/services/employee.service';
import { RequestOffService } from 'src/app/services/requestoff.service';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
  date = new Date();
  onLeaveList: RequestOffResponse[] = [];
  isVisibleModal: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private requestOffService: RequestOffService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.requestOffService.getAllRequestOff();
    this.employeeService.getAllEmployee();
    this.requestOffService.requestOffList$.subscribe((data) => {
      this.onLeaveList = data;
    });
    this.date.getTime();
  }

  formatDate(date: Date) {
    return this.datepipe.transform(date, 'MM/dd/YYYY');
  }

  openModal(date: Date) {
    this.isVisibleModal = true;
    this.date = date;
  }

  selectDateRequest(date: Date) {

  }
}
