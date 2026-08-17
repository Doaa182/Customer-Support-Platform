import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const managerGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  while (!authService.initialized()) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const user = authService.user();
  const profile = authService.profile();

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (profile?.role !== 'manager') {
    return router.createUrlTree(['/login']);
  }

  return true;
};
