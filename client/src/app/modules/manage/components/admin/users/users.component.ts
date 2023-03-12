import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Level, Position } from 'src/app/enums/Enum';
import { DepartmentResponse } from 'src/app/interfaces/interfaceReponse';
import { Department, Employee } from 'src/app/interfaces/interfaces';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  visible = false;
  employeeList: Employee[] = [];
  level = Level;
  position = Position;
  levelList = new Observable<{ value: Level; label: string }[]>();
  positionList = new Observable<{ value: Position; label: string }[]>();
  departmentList = new Observable<Department[]>();

  constructor(
    private manageService: ManageService,
  ) { }

  ngOnInit(): void {
    this.manageService.employeeList$.subscribe((data) => { this.employeeList = data });
    this.departmentList = this.manageService.departmentList$;
    this.levelList = this.manageService.levelList;
    this.positionList = this.manageService.positionList;
  }

  getDepartmentName(id: string) {
    let department!: DepartmentResponse;
    this.manageService.departmentList$
      .subscribe((data: DepartmentResponse[]) => {
        department = data.find(d => d.id == id)!;
      });
    return department;
  }

  refresh() {

  }
}
