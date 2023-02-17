import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login', component: LoginLayoutComponent, children: [
      { path: '', loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule) }
    ]
  },
  {
    path: 'manage', component: MainLayoutComponent, children: [
      { path: '', loadChildren: () => import('./modules/manage/manage.module').then((m) => m.ManageModule) }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
