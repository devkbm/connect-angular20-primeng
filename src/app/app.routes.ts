import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { Oauth2LoginSuccessComponent } from './login/oauth2-login-success.component';

import { AppLayoutComponent } from './app-layout/app-layout.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login/:id', component: LoginComponent },
  {path: 'oauth2/:id', component: Oauth2LoginSuccessComponent },
  {path: 'login', component: LoginComponent },

  {path: 'home', component: AppLayoutComponent},
  {path: 'profile', loadChildren: () => import('src/app/app-layout/app-layout.module').then(m => m.routes)},
  {path: 'system', loadChildren: () => import('src/app/system/system-management-routing.module').then(m => m.routes), data: {breadcrumb: 'system'}},

];
