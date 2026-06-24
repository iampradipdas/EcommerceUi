import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

const PUBLIC_URLS = [
  '/auth/login',
  '/auth/register',
  '/products', // public product listing
];

function isPublicUrl(url: string): boolean {
  return PUBLIC_URLS.some((pub) => url.includes(pub));
}

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  // Skip attaching token for public endpoints or if no token exists
  if (!token || isPublicUrl(req.url)) {
    return next(req);
  }

  // Clone the request — HttpRequest is immutable, never modify the original
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(clonedReq);
};
