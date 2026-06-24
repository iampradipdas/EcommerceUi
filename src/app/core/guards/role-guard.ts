import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const required = route.data['role'] as string; // e.g. 'Admin'

  if (auth.hasRole(required)) {
    return true;
  }

  router.navigate(['/products']); // redirect non-admins away
  return false;
};
