import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SalaryService } from 'src/app/services/salary.service';
import { SalaryForEmployee } from 'src/app/interfaces/interfaceReponse';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/interfaces/interfaces';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-salary-report',
  templateUrl: './salary-report.component.html',
  styleUrls: ['./salary-report.component.css']
})
export class SalaryReportComponent implements OnInit {
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  isDisable: boolean = false;
  employeeList = new Observable<Employee[]>();
  monthList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearList: number[] = [];
  filterSalaryEmployee!: string | null;
  filterSalaryMonth: number = new Date().getMonth();
  filterSalaryYear: number = new Date().getFullYear();
  detailList: SalaryForEmployee[] = [];
  data!: SalaryForEmployee;
  visibleModal: boolean = false;
  loading: boolean = false;
  
  constructor(
    private employeeService: EmployeeService,
    private salaryService: SalaryService,
    private message: NzMessageService,
  ){}
  
  ngOnInit(): void {
    this.salaryService.getAllSalary();
    this.salaryService.getAllSalaryForEmployee(new Date().getMonth(), new Date().getFullYear());
    this.salaryService.salaryForEmployeeList$.subscribe((data) => {
      this.detailList = data;
    });
    for (let i = -10; i <= 10; i++) {
      this.yearList = [...this.yearList, new Date().getFullYear() + i];
    };
    this.employeeList = this.employeeService.employeeList$;
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.detailList[event.previousIndex];
    this.detailList.splice(event.previousIndex, 1);
    this.detailList.splice(event.currentIndex, 0, item);
    this.detailList = [...this.detailList];
  }

  getEmployeeName(id: string) {
    return this.employeeService.employeeList$.value.find(i => i.appUserId == id)?.fullName;
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.detailList.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = this.detailList.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.detailList
      .forEach(({ userId }) => this.updateCheckedSet(userId, checked));
    this.refreshCheckedStatus();
  }

  sendRequest(): void {
    const requestData = this.detailList.filter(data => this.setOfCheckedId.has(data.userId));
    const response = {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      employee: requestData,
    };
    this.loading = true;
    this.salaryService.sendNotificationSalary(response)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.setOfCheckedId.clear();
          this.refreshCheckedStatus();
          this.message.success('Email sent successfully!');
          this.loading = false;
        }
      });
  }

  openModal(data: SalaryForEmployee) {
    this.data = data;
    this.visibleModal = true;
  }

  getSalaryName(id: string) {
    return this.salaryService.salaryList$.value.find(i => i.id == id)?.salaryCode;
  }

  searchName(id: string) {
    this.filterSalaryEmployee = id;
    this.salaryService.salaryForEmployeeList$.subscribe((data) => {
      this.detailList = data;
    });
    if (this.filterSalaryEmployee != null) {
      this.detailList = this.detailList.filter(i => i.userId == this.filterSalaryEmployee);
    }
  }

  filterMonth(month: number) {
    this.filterSalaryMonth = month ? month : new Date().getMonth();
    this.salaryService.getAllSalaryForEmployee(this.filterSalaryMonth ? this.filterSalaryMonth : 0, this.filterSalaryYear ? this.filterSalaryYear : 0);
    if (new Date().getMonth() == this.filterSalaryMonth && new Date().getFullYear() == this.filterSalaryYear) {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
  }

  filterYear(year: number) {
    this.filterSalaryYear = year ? year : new Date().getFullYear();
    this.salaryService.getAllSalaryForEmployee(this.filterSalaryMonth ? this.filterSalaryMonth : 0, this.filterSalaryYear ? this.filterSalaryYear : 0);
    if (new Date().getMonth() == this.filterSalaryMonth && new Date().getFullYear() == this.filterSalaryYear) {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
  }
}
