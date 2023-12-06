import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { HeaderComponent } from './layout/header/header.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { AuthModule } from './modules/auth/auth.module';
import { ManageModule } from './modules/manage/manage.module';
import { SettingComponent } from './layout/setting/setting.component';
import { NgZorroSharedModule } from './modules/ng-zorro-shared/ng-zorro-shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MemberModule } from './modules/member/member.module';
import { TagComponent } from "./shared/components/tag/tag.component";
import { RecuitmentModule } from './modules/recuitment/recuitment.module';
registerLocaleData(en);
@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        MainLayoutComponent,
        PageNotFoundComponent,
        SidebarComponent,
        LoginLayoutComponent,
        SettingComponent,
    ],
    providers: [
        { provide: NZ_I18N, useValue: en_US },
    ],
    bootstrap: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AuthModule,
        ManageModule,
        MemberModule,
        RecuitmentModule,
        NgZorroSharedModule,
        TagComponent
    ]
})
export class AppModule { }
