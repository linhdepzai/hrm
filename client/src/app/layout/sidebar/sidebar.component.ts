import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginResponse } from 'src/app/interfaces/interfaceReponse';
import { AuthenticationService } from 'src/app/modules/auth/services/authentication.service';
import { DepartmentService } from 'src/app/services/department.service';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  coverAvt: string = '';
  user!: LoginResponse;
  isVisibleAvatar: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private positionService: PositionService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.coverAvt = 'https://static.wixstatic.com/media/5b44bf_317f722d308c4426a6ba01e3c61bf072~mv2_d_4206_2366_s_2.jpg/v1/fill/w_980,h_551,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/5b44bf_317f722d308c4426a6ba01e3c61bf072~mv2_d_4206_2366_s_2.jpg';
  }

  logout() {
    this.close.emit();
    this.authenticationService.logout();
  }
}
