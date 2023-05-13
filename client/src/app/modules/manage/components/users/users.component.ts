import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Level } from 'src/app/enums/Enum';
import { DepartmentResponse, Position } from 'src/app/interfaces/interfaceReponse';
import { Department, Employee } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  visible = false;
  employeeList: Employee[] = [];
  level = Level;
  levelList = new Observable<{ value: Level; label: string }[]>();
  positionList = new Observable<Position[]>();
  departmentList = new Observable<Department[]>();
  data: Employee | undefined;
  modalMode: string = 'create';
  statusMode: string = 'Approve';

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.departmentService.getAllDepartment();
    this.employeeService.getAllEmployee();
    this.employeeService.getAllRequestChangeInfo();
    this.employeeService.employeeList$.subscribe((data) => { this.employeeList = data });
    this.departmentList = this.departmentService.departmentList$;
    this.levelList = this.dataService.levelList;
    this.positionList = this.dataService.positionList;
  }

  getDepartmentName(id: string) {
    let department!: DepartmentResponse;
    this.departmentService.departmentList$
      .subscribe((data: DepartmentResponse[]) => {
        department = data.find(d => d.id == id)!;
      });
    return department;
  }

  openModal(data: Employee | undefined, mode: string) {
    this.data = data;
    this.modalMode = mode;
    this.visible = true;
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.employeeList[event.previousIndex];
    this.employeeList.splice(event.previousIndex, 1);
    this.employeeList.splice(event.currentIndex, 0, item);
    this.employeeList = [...this.employeeList];
  }

  changeFilter(mode: string) {
    this.statusMode = mode;
    if (mode == 'Approve') {
      this.employeeService.employeeList$.subscribe((data) => { this.employeeList = data });
    } else {
      this.employeeService.requestChangeInfoList$.subscribe((data) => { this.employeeList = data });
    }
  }

  getPositionName(id: number) {
    return this.dataService.positionList.value.find(i => i.id == id)?.name;
  }

  searchName(name: string) {
    this.changeFilter(this.statusMode);
    if (name != null) {
      this.employeeList = this.employeeList.filter(i => i.fullName == name);
    }
  }

  filterLevel(level: number) {
    this.changeFilter(this.statusMode);
    if (level != null) {
      this.employeeList = this.employeeList.filter(i => i.level == level);
    }
  }

  filterPosition(position: number) {
    this.changeFilter(this.statusMode);
    if (position != null) {
      this.employeeList = this.employeeList.filter(i => i.position == position);
    }
  }

  filterDepartment(department: string) {
    this.changeFilter(this.statusMode);
    if (department != null) {
      this.employeeList = this.employeeList.filter(i => i.departmentId == department);
    }
  }
}
