import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  visibleSidebar = false;
  visibleSetting = false;
  isVisibleModalChangePassword = false;

  openSidebar(): void {
    this.visibleSidebar = true;
  }

  closeSidebar(): void {
    this.visibleSidebar = false;
  }

  openSetting(): void {
    this.visibleSetting = true;
  }

  closeSetting(): void {
    this.visibleSetting = false;
  }

  openModalChangePassword(): void {
    this.isVisibleModalChangePassword = true;
  }
}
