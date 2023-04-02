import { Component } from '@angular/core';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  theme = '';
  
  constructor(
    private nzConfigService: NzConfigService,
    private setting: DataService,
  ) {
    this.setting.themeColor.subscribe((data) => { this.theme = data; this.onChangeConfig() });
  }

  onChangeConfig() {
    this.nzConfigService.set('theme', { primaryColor: this.theme as string });
  }
}
