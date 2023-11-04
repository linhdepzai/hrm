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
  user: LoginResponse = JSON.parse(localStorage.getItem('user')!);
  isVisibleModalChangeProfile: boolean = false;
  isVisibleModalChangePassword: boolean = false;
  level = Level;

  constructor(
    ) { }

  ngOnInit(): void {
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
}
