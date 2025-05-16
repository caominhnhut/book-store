import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Kiểm tra xem người dùng đã đăng nhập và có quyền admin hay không
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }
  
  // Nếu không phải admin, chuyển hướng về trang login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
