import { Component, OnInit } from '@angular/core';
import { Level } from 'src/app/enums/Enum';
import { DepartmentResponse, LoginResponse, Position } from 'src/app/interfaces/interfaceReponse';
import { DepartmentService } from 'src/app/services/department.service';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: LoginResponse;
  isVisibleModalChangeProfile: boolean = false;
  isVisibleModalChangePassword: boolean = false;
  level = Level;

  constructor(
    private departmentService: DepartmentService,
    private positionService: PositionService,
    ) { }

  ngOnInit(): void {
    this.departmentService.getAllDepartment();
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  }

  refresh() {
    document.location.reload();
  }

  openModalChangeInfo() {
    this.isVisibleModalChangeProfile = true;
  }

  openModalChangePassword() {
    this.isVisibleModalChangePassword = true;
  }

  getDepartment(id: string): DepartmentResponse {
    return this.departmentService.departmentList$.value.find(d => d.id == id)!;
  }

  getPosition(id: number): Position {
    return this.positionService.positionList$.value.find(i => i.id == id)!;
  }
}
