import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { MainLayoutComponent } from './main-layout.component';
import { LoginComponent } from './login.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // Guard blocks this if no token

  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  // Catch-all: If route doesn't exist, try to go home (which triggers guard -> login)
  { path: '**', redirectTo: '' } 
];