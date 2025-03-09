import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (_, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!state.url.includes('login') && !userService.getUsername()) {
    router.navigate(['/login']);
  }

  return true;
};
