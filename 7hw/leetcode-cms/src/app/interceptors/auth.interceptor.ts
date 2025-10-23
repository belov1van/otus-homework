import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  
  // Only try to get token if in browser environment
  if (isBrowser) {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, clone the request and add the authorization header
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    }
  }
  
  // If no token or not in browser, proceed with the original request
  return next(req);
}