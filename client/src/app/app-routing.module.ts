import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';
import { AuthGuard } from './modules/auth/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'recuitment', loadChildren: () => import('./modules/recuitment/recuitment.module').then((m) => m.RecuitmentModule)
  },
  {
    path: 'login', component: LoginLayoutComponent, children: [
      { path: '', loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule) }
    ]
  },
  {
    path: 'manage', component: MainLayoutComponent, children: [
      { path: '', loadChildren: () => import('./modules/manage/manage.module').then((m) => m.ManageModule) }
    ], canActivate: [AuthGuard]
  },
  {
    path: 'member', component: MainLayoutComponent, children: [
      { path: '', loadChildren: () => import('./modules/member/member.module').then((m) => m.MemberModule) }
    ], canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
