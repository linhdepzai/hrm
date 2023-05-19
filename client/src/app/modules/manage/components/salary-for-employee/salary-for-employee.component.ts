import { Component, OnInit } from '@angular/core';
import { SalaryForEmployee } from 'src/app/interfaces/interfaceReponse';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SalaryService } from 'src/app/services/salary.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-salary-for-employee',
  templateUrl: './salary-for-employee.component.html',
  styleUrls: ['./salary-for-employee.component.css']
})
export class SalaryForEmployeeComponent implements OnInit {
  salaryForEmployeeList: SalaryForEmployee[] = [];
  visibleModal: boolean = false;
  data!: SalaryForEmployee;
  employeeList = new Observable<Employee[]>();
  monthList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearList: number[] = [];
  filterSalaryEmployee!: string | null;
  filterSalaryMonth!: number | null;
  filterSalaryYear!: number | null;

  constructor(
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void {
    this.salaryService.getAllSalaryForEmployee();
    this.salaryService.getAllSalary();
    this.employeeService.getAllEmployee();
    this.employeeList = this.employeeService.employeeList$;
    this.salaryService.salaryForEmployeeList$.subscribe((data) => {
      this.salaryForEmployeeList = data;
    });
    for (let i = -10; i <= 10; i++) {
      this.yearList = [...this.yearList, new Date().getFullYear() + i];
    };
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.salaryForEmployeeList[event.previousIndex];
    this.salaryForEmployeeList.splice(event.previousIndex, 1);
    this.salaryForEmployeeList.splice(event.currentIndex, 0, item);
    this.salaryForEmployeeList = [...this.salaryForEmployeeList];
  }

  getSalaryName(id: string) {
    return this.salaryService.salaryList$.value.find(i => i.id == id)?.salaryCode;
  }

  getEmployeeName(id: string) {
    return this.employeeService.employeeList$.value.find(i => i.id == id)?.fullName;
  }

  formatVND(price: number) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(price)
  }

  openModal(data: SalaryForEmployee) {
    this.data = data;
    this.visibleModal = true;
  }

  filterSalary() {
    this.salaryService.salaryForEmployeeList$.subscribe((data) => {
      this.salaryForEmployeeList = data;
    });
    if (this.filterSalaryEmployee != null) {
      this.salaryForEmployeeList = this.salaryForEmployeeList.filter(i => i.employeeId == this.filterSalaryEmployee);
    }
    if (this.filterSalaryMonth != null) {
      this.salaryForEmployeeList = this.salaryForEmployeeList.filter(i => new Date(i.date).getMonth() == this.filterSalaryMonth);
    }
    if (this.filterSalaryYear != null) {
      this.salaryForEmployeeList = this.salaryForEmployeeList.filter(i =>
        new Date(new Date(i.date).getDate() + '/' + new Date(i.date).getMonth() + '/' + new Date(i.date).getFullYear()).getFullYear() == this.filterSalaryYear);
      this.yearList = [];
      for (let i = -10; i <= 10; i++) {
        this.yearList = [...this.yearList, this.filterSalaryYear + i];
      };
    }
  }

  searchName(id: string) {
    this.filterSalaryEmployee = id;
    this.filterSalary();
  }

  filterMonth(month: number) {
    this.filterSalaryMonth = month;
    this.filterSalary();
  }

  filterYear(year: number) {
    this.filterSalaryYear = year;
    this.filterSalary();
  }
}
