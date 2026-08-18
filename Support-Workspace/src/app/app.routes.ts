import { Routes } from '@angular/router';
import { agentGuard } from './core/guards/agent.guard';
import { managerGuard } from './core/guards/manager.guard';
import { ManagerDashboard } from './pages/manager-dashboard/manager-dashboard';
import { AgentDashboard } from './pages/agent-dashboard/agent-dashboard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'agent',
    component: AgentDashboard,
    canActivate: [agentGuard],
  },
  {
    path: 'agent/requests/:id',
    loadComponent: () =>
      import('./pages/agent-request-details/agent-request-details').then(
        (m) => m.AgentRequestDetails,
      ),
    canActivate: [agentGuard],
  },
  {
    path: 'manager',
    component: ManagerDashboard,
    canActivate: [managerGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
