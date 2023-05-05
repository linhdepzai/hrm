import { Component, OnInit } from '@angular/core';
import { Level } from 'src/app/enums/Enum';
import { DepartmentResponse, LoginResponse, Position } from 'src/app/interfaces/interfaceReponse';
import { DepartmentService } from '../../services/department.service';
import { DataService } from 'src/app/services/data.service';

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
    protected dataService: DataService,
  ) {
  }

  ngOnInit(): void {
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
    return this.dataService.positionList.value.find(i => i.id == id)!;
  }
}
