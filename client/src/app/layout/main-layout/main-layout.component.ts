import { Component } from '@angular/core';
import { ManageService } from 'src/app/modules/manage/services/manage.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  loading: boolean = false;

  constructor(
    private manageService: ManageService,
  ) {
    this.manageService.loading.subscribe((data) => {
      this.loading = data;
    });
  }
}
