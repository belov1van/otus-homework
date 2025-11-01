import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route: import('@angular/router').ActivatedRouteSnapshot, state: import('@angular/router').RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};