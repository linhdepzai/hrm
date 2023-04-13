import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { NgZorroSharedModule } from '../ng-zorro-shared/ng-zorro-shared.module';
registerLocaleData(en);

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    NgZorroSharedModule,
  ],
  exports: [
    AuthRoutingModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
  ]
})
export class AuthModule { }
