import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';

/**
 * Account management for the signed-in user.
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly http = inject(HttpClient);

  /**
   * Changes the signed-in user's password.
   * @param currentPassword The password in use now.
   * @param newPassword The replacement, 8 to 100 characters.
   * @returns Completes once changed; errors with the `HttpErrorResponse` (400 when the current password is wrong).
   */
  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post(
      `${environment.APIBaseURL}/User/ChangePassword`,
      { CurrentPassword: currentPassword, NewPassword: newPassword }
    ).pipe(map(() => undefined));
  }
}
