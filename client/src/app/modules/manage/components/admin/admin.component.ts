import { Component, OnInit } from '@angular/core';
import { ManageService } from '../../services/manage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    private manageService: ManageService,
  ){}

  ngOnInit(): void {
    this.manageService.getAllDepartment();
    this.manageService.getAllEmployee();
  }
}
