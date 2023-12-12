import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecuitmentRoutingModule } from './recuitment-routing.module';
import { CareerComponent } from './components/career/career.component';
import { NgZorroSharedModule } from '../ng-zorro-shared/ng-zorro-shared.module';
import { JobDetailComponent } from './components/job-detail/job-detail.component';

@NgModule({
  declarations: [
    CareerComponent,
    JobDetailComponent,
  ],
  imports: [
    CommonModule,
    NgZorroSharedModule,
  ],
  exports: [
    RecuitmentRoutingModule,
  ],
})
export class RecuitmentModule { }
