import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = (route: import('@angular/router').ActivatedRouteSnapshot, state: import('@angular/router').RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (!user || user.role !== 'admin') {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};