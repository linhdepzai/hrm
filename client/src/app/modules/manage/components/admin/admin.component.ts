import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
  ){}

  ngOnInit(): void {
    this.departmentService.getAllDepartment();
    this.employeeService.getAllEmployee();
  }
}
