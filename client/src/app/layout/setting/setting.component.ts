import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {

  constructor(private apiService: ApiService){}

  changeTheme(color: string){
    this.apiService.themeColor.next(color);
  }
}
