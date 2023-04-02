import { Component, OnInit } from '@angular/core';
import { Level, Position } from 'src/app/enums/Enum';
import { DepartmentResponse, LoginResponse } from 'src/app/interfaces/interfaceReponse';
import { ManageService } from '../../services/manage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: LoginResponse;
  isVisibleModal: boolean = false;
  level = Level;
  position = Position;

  constructor(
    private manageService: ManageService,
  ) { 
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  }

  refresh() {
    document.location.reload();
  }

  openModalChangeInfo() {
    this.isVisibleModal = true;
  }

  getDepartment(id: string) {
    let department!: DepartmentResponse;
    this.manageService.departmentList$
      .subscribe((data: DepartmentResponse[]) => {
        department = data.find(d => d.id == id)!;
      });
    return department;
  }
}
