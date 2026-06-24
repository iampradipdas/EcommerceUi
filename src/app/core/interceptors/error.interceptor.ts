import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { ToastService } from '../services/toast-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 401:
          // Token expired or missing — log out and go to login
          auth.logout();
          toast.show('Session expired. Please login again.', 'error');
          router.navigate(['/auth/login']);
          break;

        case 403:
          // Logged in but wrong role
          toast.show('You do not have permission to do this.', 'error');
          router.navigate(['/products']);
          break;

        case 404:
          toast.show('Resource not found.', 'error');
          break;

        case 500:
          toast.show('Server error. Please try again later.', 'error');
          break;

        default:
          const message = err.error?.message || 'Something went wrong.';
          toast.show(message, 'error');
      }

      // Re-throw so the component's error() callback also fires if needed
      return throwError(() => err);
    }),
  );
};
