import { Component, OnInit } from '@angular/core';
import { SalaryForEmployee } from 'src/app/interfaces/interfaceReponse';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SalaryService } from 'src/app/services/salary.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { Observable } from 'rxjs';
import { Employee, NotificationSalaryPayload } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-salary-for-employee',
  templateUrl: './salary-for-employee.component.html',
  styleUrls: ['./salary-for-employee.component.css']
})
export class SalaryForEmployeeComponent implements OnInit {
  detailList: SalaryForEmployee[] = [];
  salaryForEmployeeList: any[] = [];
  visibleModal: boolean = false;
  visibleModalGeneral: boolean = false;
  data!: SalaryForEmployee;
  dataGeneral: any;
  employeeList = new Observable<Employee[]>();
  monthList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearList: number[] = [];
  filterSalaryEmployee!: string | null;
  filterSalaryMonth: number = new Date().getMonth();
  filterSalaryYear: number = new Date().getFullYear();
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  isDisable: boolean = false;

  constructor(
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void {
    this.salaryService.getAllSalaryForEmployee(new Date().getMonth(), new Date().getFullYear());
    this.salaryService.getAllSalary();
    this.employeeService.getAllEmployee();
    this.employeeList = this.employeeService.employeeList$;
    this.salaryService.salaryForEmployeeList$.subscribe((data) => {
      this.detailList = data;
    });
    for (let i = -10; i <= 10; i++) {
      this.yearList = [...this.yearList, new Date().getFullYear() + i];
    };
    this.salaryService.GetSalaryForEmployee().subscribe((response) => {
      this.salaryForEmployeeList = response.data;
    });
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.detailList[event.previousIndex];
    this.detailList.splice(event.previousIndex, 1);
    this.detailList.splice(event.currentIndex, 0, item);
    this.detailList = [...this.detailList];
  }

  getSalaryName(id: string) {
    return this.salaryService.salaryList$.value.find(i => i.id == id)?.salaryCode;
  }

  getEmployeeName(id: string) {
    return this.employeeService.employeeList$.value.find(i => i.id == id)?.fullName;
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
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  sendRequest(): void {
    const requestData = this.detailList.filter(data => this.setOfCheckedId.has(data.id));
    const response = {
      actionId: '',
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      employee: requestData,
    };
    this.salaryService.sendNotificationSalary(response)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.setOfCheckedId.clear();
          this.refreshCheckedStatus();
        }
      });
  }

  openModal(data: SalaryForEmployee) {
    this.data = data;
    this.visibleModal = true;
  }

  openModalGeneral(data: any) {
    this.dataGeneral = data;
    this.visibleModalGeneral = true;
  }

  submitModal(data: any) {
    this.salaryForEmployeeList.splice(
      this.salaryForEmployeeList.findIndex((item) => item.id === data.id),
      1, data);
    this.salaryForEmployeeList = [...this.salaryForEmployeeList];
  }

  searchName(id: string) {
    this.filterSalaryEmployee = id;
    this.salaryService.salaryForEmployeeList$.subscribe((data) => {
      this.detailList = data;
    });
    if (this.filterSalaryEmployee != null) {
      this.detailList = this.detailList.filter(i => i.employeeId == this.filterSalaryEmployee);
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
