import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {
  themeColor: string = '';

  constructor(private dataService: DataService) {
    this.dataService.themeColor.subscribe((data) => {
      this.themeColor = data;
    });
  }

  changeTheme(color: any) {
    this.dataService.themeColor.next(color);
  }
}
