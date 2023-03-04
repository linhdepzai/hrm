import { Component } from '@angular/core';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { ApiService } from './services/api.service';

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
    private setting: ApiService,
  ) {
    this.setting.themeColor.subscribe((data) => { this.theme = data });
  }
  
  ngDoCheck(): void {
    this.onChangeConfig();
  }

  onChangeConfig() {
    this.nzConfigService.set('theme', { primaryColor: this.theme as string });
  }
}
