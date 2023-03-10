import { Component, EventEmitter, Output } from '@angular/core';
import { LoginResponse } from 'src/app/interfaces/interfaceReponse';
import { AuthenticationService } from 'src/app/modules/auth/services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() close = new EventEmitter<any>();
  coverAvt: string = '';
  user!: LoginResponse;

  constructor(private authenticationService: AuthenticationService){ 
    this.coverAvt = 'https://static.wixstatic.com/media/5b44bf_317f722d308c4426a6ba01e3c61bf072~mv2_d_4206_2366_s_2.jpg/v1/fill/w_980,h_551,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/5b44bf_317f722d308c4426a6ba01e3c61bf072~mv2_d_4206_2366_s_2.jpg',
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  }

  logout(){
    this.close.emit();
    this.authenticationService.logout();
  }
}
