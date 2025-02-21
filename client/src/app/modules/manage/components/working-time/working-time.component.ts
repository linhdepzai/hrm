import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/interfaces/interfaces';
import { TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { Status } from 'src/app/enums/Enum';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EmployeeService } from 'src/app/services/employee.service';
import { TimeworkingService } from 'src/app/services/timeworking.service';

@Component({
  selector: 'app-working-time',
  templateUrl: './working-time.component.html',
  styleUrls: ['./working-time.component.css']
})
export class WorkingTimeComponent implements OnInit {
  isVisibleModal: boolean = false;
  employeeList = new Observable<Employee[]>();
  timeWorkingList: TimeWorkingResponse[] = [];
  itemWorkingTime!: TimeWorkingResponse;
  filterList: TimeWorkingResponse[] = [];
  optionFilter: string = 'Approve';

  constructor(
    private employeeService: EmployeeService,
    private timeWorkingService: TimeworkingService,
  ) { }

  ngOnInit(): void {
    this.employeeService.getAllEmployee();
    this.employeeList = this.employeeService.employeeList$;
    this.timeWorkingService.getAllTimeWorking();
    this.timeWorkingService.timeWorkingList$.subscribe((data) => {
      this.timeWorkingList = data;
      this.changeFilter(this.optionFilter);
    });
  }

  changeStatusWorkingTime(data: TimeWorkingResponse) {
    this.itemWorkingTime = data;
    this.isVisibleModal = true;
  }

  getUserName(id: string) {
    return this.employeeService.employeeList$.value.find(d => d.appUserId == id)?.fullName;
  }

  calcTime(startTime: any, endTime: any) {
    const total = endTime.substring(0, 2) - startTime.substring(0, 2);
    const totalMinute = (endTime.substring(3, 5) - startTime.substring(3, 5)) / 60;
    return total + totalMinute;
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.filterList[event.previousIndex];
    this.filterList.splice(event.previousIndex, 1);
    this.filterList.splice(event.currentIndex, 0, item);
    this.filterList = [...this.filterList];
  }

  searchName(id: string) {
    if(id != null) {
      this.changeFilter(this.optionFilter);
      this.filterList = this.filterList.filter(i => i.userId == id);
    } else {
      this.changeFilter(this.optionFilter);
    }
  }

  changeFilter(value: string) {
    this.optionFilter = value;
    if (value == 'Pending') {
      this.filterList = this.timeWorkingList.filter(i => i.status == Status.Pending);
    } else if (value == 'Approve') {
      this.filterList = this.timeWorkingList.filter(i => i.status == Status.Approved && new Date(i.applyDate) < new Date());
      this.employeeService.employeeList$.value.filter(i => i.status == Status.Approved).forEach((item) => {
        const duplicate = this.filterList.filter(i => i.userId == item.id);
        if (duplicate.length > 1) {
          const index = this.filterList.findIndex((i) => i.userId == item.id && i.id != duplicate[0].id);
          this.filterList.splice(index, 1);
          this.filterList = [...this.filterList];
        }
      })
    } else {
      this.filterList = this.timeWorkingList;
    };
  }
}
