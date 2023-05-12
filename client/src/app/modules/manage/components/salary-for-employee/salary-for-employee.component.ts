import { Component, OnInit } from '@angular/core';
import { SalaryService } from '../../services/salary.service';
import { SalaryForEmployee } from 'src/app/interfaces/interfaceReponse';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-salary-for-employee',
  templateUrl: './salary-for-employee.component.html',
  styleUrls: ['./salary-for-employee.component.css']
})
export class SalaryForEmployeeComponent implements OnInit {
  salaryForEmployeeList: SalaryForEmployee[] = [];
  visibleModal: boolean = false;
  data!: SalaryForEmployee;

  constructor(
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void {
    this.salaryService.getAllSalaryForEmployee();
    this.salaryService.getAllSalary();
    this.employeeService.getAllEmployee();
    this.salaryService.salaryForEmployeeList$.subscribe((data) => {
      this.salaryForEmployeeList = data;
    });
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
}
