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
  salaryForEmployeeList: any[] = [];
  visibleModalGeneral: boolean = false;
  dataGeneral: any;

  constructor(
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void {
    this.salaryService.getAllSalary();
    this.employeeService.getAllEmployee();
    this.salaryService.GetSalaryForEmployee().subscribe((response) => {
      this.salaryForEmployeeList = response.data;
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
    return this.employeeService.employeeList$.value.find(i => i.appUserId == id)?.fullName;
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
}
