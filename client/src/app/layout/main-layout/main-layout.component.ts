import { Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, DoCheck {
  title = 'Home Page';
  subtitle = '';

  constructor() { }

  ngDoCheck() {
    this.changeTitle();
  }

  ngOnInit(): void {
    this.changeTitle();
  }

  changeTitle(){
    const location = document.location.pathname;
    if (location.indexOf('home') !== -1) {
      this.title = "Home Page";
      this.subtitle = '';
    } else if (location.indexOf('profile') !== -1) {
      this.title = "My Profile";
      this.subtitle = '';
    } else if (location.indexOf('admin') !== -1) {
      this.title = 'Admin';
      if (location.indexOf('users') !== -1) {
        this.subtitle = 'Users';
      } else if (location.indexOf('roles') !== -1) {
        this.subtitle = 'Roles';
      } else {
        this.subtitle = 'Working Time';
      }
    } else if (location.indexOf('timesheet') !== -1) {
      this.title = 'Timesheet';
      this.subtitle = '';
    } else if (location.indexOf('checkin') !== -1) {
      this.title = 'Check In';
      this.subtitle = '';
    } else {
      this.title = 'Request Off';
      this.subtitle = '';
    }
  }
}
