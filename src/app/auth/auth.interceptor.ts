import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

/**
 * Adds the bearer token to Web API requests, and signs the user out when the API rejects it.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  // Only the Web API gets the token; it must never be sent to another host.
  if (!request.url.startsWith(`${environment.APIBaseURL}/`)) {
    return next(request);
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token();
  const authorized = token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;

  return next(authorized).pipe(
    catchError((error: unknown) => {
      // A 401 on a request that carried a token means the session is no longer valid.
      // Without a token (e.g. a failed login) the caller handles the 401 itself.
      if (token && error instanceof HttpErrorResponse && error.status === 401) {
        auth.logout();
        void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => error);
    })
  );
};
