import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const required = route.data['role'] as string; // e.g. 'Admin'

  if (auth.hasRole(required)) {
    return true;
  }

  router.navigate(['/products']); // redirect non-admins away
  return false;
};
