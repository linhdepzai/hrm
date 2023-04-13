import { Component, OnInit } from '@angular/core';
import { Level, Position } from 'src/app/enums/Enum';
import { DepartmentResponse, LoginResponse } from 'src/app/interfaces/interfaceReponse';
import { DepartmentService } from '../../services/department.service';

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
  position = Position;

  constructor(
    private departmentService: DepartmentService,
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

  getDepartment(id: string) {
    let department!: DepartmentResponse;
    this.departmentService.departmentList$
      .subscribe((data: DepartmentResponse[]) => {
        department = data.find(d => d.id == id)!;
      });
    return department;
  }
}
