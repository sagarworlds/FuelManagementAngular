import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';

/** Body of a successful `POST User/Login` response from the Web API. */
export interface LoginResponse {
  Token: string;
  /** ISO-8601 UTC time after which the API rejects the token. */
  ExpiresAt: string;
  UserId: number;
  Email: string;
}

/** The signed-in user's session. */
export interface AuthSession {
  token: string;
  /** Expiry as milliseconds since the epoch. */
  expiresAt: number;
  userId: number;
  email: string;
}

/** Where the session is persisted between page loads; `localStorage` unless overridden (e.g. in tests). */
export const SESSION_STORAGE = new InjectionToken<Storage>('SESSION_STORAGE', {
  providedIn: 'root',
  factory: () => localStorage
});

const STORAGE_KEY = 'fuel-management.session';

/**
 * Signs users in and out and holds the current session.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(SESSION_STORAGE);
  private readonly currentSession = signal<AuthSession | null>(this.restore());

  /**
   * The current session, or null when signed out. It is a signal, so templates update on login and logout.
   * It is not cleared the moment the token expires: `isAuthenticated()` and `token()` handle that.
   */
  readonly session = this.currentSession.asReadonly();

  /**
   * Exchanges credentials for a token and starts a session.
   * @param email The user's email.
   * @param password The user's password.
   * @returns Completes once signed in; errors with the `HttpErrorResponse` (401 for wrong credentials).
   */
  login(email: string, password: string): Observable<void> {
    return this.http.post<LoginResponse>(`${environment.APIBaseURL}/User/Login`, { Email: email, Password: password }).pipe(
      map(response => this.startSession(response))
    );
  }

  /**
   * Starts (or replaces) the session from a token the API issued, e.g. at login or after a password change.
   * @param response The API's login response.
   */
  startSession(response: LoginResponse): void {
    const session: AuthSession = {
      token: response.Token,
      expiresAt: Date.parse(response.ExpiresAt),
      userId: response.UserId,
      email: response.Email
    };
    this.storage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.currentSession.set(session);
  }

  /** Ends the session. */
  logout(): void {
    this.storage.removeItem(STORAGE_KEY);
    this.currentSession.set(null);
  }

  /**
   * Whether a session exists and has not expired; an expired session is ended.
   * Call from code (guards, handlers), not from templates, since it can end the session.
   */
  isAuthenticated(): boolean {
    return this.token() !== null;
  }

  /**
   * The bearer token for API calls, or null when signed out or expired (an expired session is ended).
   */
  token(): string | null {
    const session = this.currentSession();
    if (!session) {
      return null;
    }
    if (session.expiresAt <= Date.now()) {
      this.logout();
      return null;
    }
    return session.token;
  }

  /** Reads a saved session, discarding one that is expired or unreadable. */
  private restore(): AuthSession | null {
    const saved = this.storage.getItem(STORAGE_KEY);
    if (saved === null) {
      return null;
    }

    let session: Partial<AuthSession> | null;
    try {
      const parsed: unknown = JSON.parse(saved);
      session = typeof parsed === 'object' ? parsed as Partial<AuthSession> | null : null;
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
      console.warn('Discarding an unreadable saved session.', error);
      this.storage.removeItem(STORAGE_KEY);
      return null;
    }

    const isValid = session !== null
      && typeof session.token === 'string'
      && typeof session.expiresAt === 'number'
      && typeof session.userId === 'number'
      && typeof session.email === 'string'
      && session.expiresAt > Date.now();
    if (!isValid) {
      this.storage.removeItem(STORAGE_KEY);
      return null;
    }
    return session as AuthSession;
  }
}
