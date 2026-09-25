import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService, LoginResponse } from '../auth/auth.service';

/**
 * Account management: registration and password changes.
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  /**
   * Creates an account. It does not sign the user in.
   * @param email The new account's email.
   * @param password The password, 8 to 100 characters.
   * @returns Completes once created; errors with the `HttpErrorResponse` (400 invalid, 409 email taken).
   */
  register(email: string, password: string): Observable<void> {
    return this.http.post(`${environment.APIBaseURL}/User/Save`, { Email: email, Password: password })
      .pipe(map(() => undefined));
  }

  /**
   * Changes the signed-in user's password. The API then rejects every earlier token, so the
   * session switches to the new token it returns; other devices are signed out.
   * @param currentPassword The password in use now.
   * @param newPassword The replacement, 8 to 100 characters.
   * @returns Completes once changed; errors with the `HttpErrorResponse` (400 when the current password is wrong).
   */
  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<LoginResponse>(
      `${environment.APIBaseURL}/User/ChangePassword`,
      { CurrentPassword: currentPassword, NewPassword: newPassword }
    ).pipe(map(response => this.auth.startSession(response)));
  }
}
