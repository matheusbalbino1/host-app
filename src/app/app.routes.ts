import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { ListClientsComponent } from './pages/list-clients/list-clients.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    canActivate: [authGuard],
    component: LoginComponent,
  },
  {
    path: 'clients',
    canActivate: [authGuard],
    component: ListClientsComponent,
  },
  {
    path: 'clients/selected',
    canActivate: [authGuard],
    component: ListClientsComponent,
  },
];
