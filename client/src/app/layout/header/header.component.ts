import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  visible = false;
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
