import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-recuitment',
  templateUrl: './layout-recuitment.component.html',
  styleUrls: ['./layout-recuitment.component.css']
})
export class LayoutRecuitmentComponent {
  openSocial(link: string){
    document.location.href = link;
  }
}
