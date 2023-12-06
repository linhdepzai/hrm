import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareerComponent } from './components/career/career.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full', component: CareerComponent },
  { path: ':id', component: JobDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecuitmentRoutingModule { }
