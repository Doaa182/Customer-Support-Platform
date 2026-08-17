import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const agentGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();
  const profile = authService.profile();

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (profile?.role !== 'agent') {
    return router.createUrlTree(['/login']);
  }

  return true;
};
