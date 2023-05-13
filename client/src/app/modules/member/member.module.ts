import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroSharedModule } from '../ng-zorro-shared/ng-zorro-shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    NgZorroSharedModule,
  ],
  exports: [
    MemberRoutingModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
  ]})
export class MemberModule { }
