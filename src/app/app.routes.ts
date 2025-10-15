import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    data: { breadcrumb: 'Inicio de Sesión' },
    component: LoginComponent,
  },
  {
    path: 'auth/sign-up',
    data: { breadcrumb: 'Registro' },
    component: SignUpComponent,
  },
  {
    path: 'hybridchatbot',
    loadChildren: () =>
      import('./components/pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];
