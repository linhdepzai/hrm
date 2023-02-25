import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/modules/auth/services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private authenticationService: AuthenticationService){ }

  logout(){
    this.authenticationService.logout();
  }
}
