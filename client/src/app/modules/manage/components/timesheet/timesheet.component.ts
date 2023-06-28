import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OnLeaveResponse } from 'src/app/interfaces/interfaceReponse';
import { Employee } from 'src/app/interfaces/interfaces';
import { EmployeeService } from 'src/app/services/employee.service';
import { OnleaveService } from 'src/app/services/onleave.service';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
  date = new Date();
  onLeaveList: OnLeaveResponse[] = [];
  isVisibleModal: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private onleaveService: OnleaveService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.onleaveService.getAllRequestOnLeave();
    this.employeeService.getAllEmployee();
    this.onleaveService.onLeaveList$.subscribe((data) => {
      this.onLeaveList = data;
    });
    this.date.getTime();
  }

  formatDate(date: Date) {
    return this.datepipe.transform(date, 'MM/dd/YYYY');
  }

  getAccount(id: string): Employee {
    return this.employeeService.employeeList$.value.find(d => d.id == id)!;
  }

  openModal(date: Date) {
    this.isVisibleModal = true;
    this.date = date;
  }

  selectDateRequest(date: Date) {

  }
}
