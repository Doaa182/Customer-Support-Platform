import { Routes } from '@angular/router';
import { Dashboard } from './features/agent/dashboard/dashboard';
import { agentGuard } from './core/guards/agent.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'agent',
    component: Dashboard,
    canActivate: [agentGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
