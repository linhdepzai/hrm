import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  isVisibleModal: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.user = sessionStorage.getItem('user') || '{}';
  }

  refresh() {
    document.location.reload();
  }

  openModalChangeInfo() {
    this.isVisibleModal = true;
  }
}
