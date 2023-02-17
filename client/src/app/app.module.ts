import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { CommonModule, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './layout/header/header.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthModule } from './modules/auth/auth.module';
import { ManageModule } from './modules/manage/manage.module';
registerLocaleData(en);
const ngZorroConfig: NzConfig = {
  theme: {
    primaryColor: '#00000',
  },
  message: { nzTop: 120 },
  notification: { nzTop: 240 }
};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainLayoutComponent,
    PageNotFoundComponent,
    SidebarComponent,
    LoginLayoutComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    ManageModule,
    NzButtonModule,
    NzLayoutModule,
    NzNoAnimationModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzGridModule,
    NzDrawerModule,
    NzIconModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_CONFIG, useValue:  ngZorroConfig  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
