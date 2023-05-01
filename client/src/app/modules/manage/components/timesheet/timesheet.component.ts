import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OnleaveService } from '../../services/onleave.service';
import { OnLeaveResponse } from 'src/app/interfaces/interfaceReponse';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from 'src/app/interfaces/interfaces';

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
    this.onleaveService.onLeaveList$.subscribe((data) => {
      this.onLeaveList = data;
    });
    this.date.getTime();
  }

  formatDate(date: Date) {
    return this.datepipe.transform(date, 'MM/dd/YYYY');
  }

  getAccount(id: string): Employee {
    let employee!: Employee;
    this.employeeService.employeeList$
      .subscribe((data: Employee[]) => {
        employee = data.find(d => d.id == id)!;
      });
    return employee;
  }

  openModal(date: Date) {
    this.isVisibleModal = true;
    this.date = date;
  }

  selectDateRequest(date: Date) {

  }
}
