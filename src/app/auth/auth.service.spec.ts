import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { AuthService, AuthSession, LoginResponse } from './auth.service';

describe('AuthService', () => {
  const storageKey = 'fuel-management.session';
  const loginUrl = `${environment.APIBaseURL}/User/Login`;
  let httpMock: HttpTestingController;

  const inOneHour = () => new Date(Date.now() + 60 * 60 * 1000).toISOString();

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should start signed out', () => {
    const auth = TestBed.inject(AuthService);

    expect(auth.session()).toBeNull();
    expect(auth.token()).toBeNull();
    expect(auth.isAuthenticated()).toBe(false);
  });

  it('should post the credentials and keep the returned token', () => {
    const auth = TestBed.inject(AuthService);
    const response: LoginResponse = { Token: 'abc', ExpiresAt: inOneHour(), UserId: 7, Email: 'seven@example.com' };

    auth.login('seven@example.com', 'secret').subscribe();
    const req = httpMock.expectOne(loginUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ Email: 'seven@example.com', Password: 'secret' });
    req.flush(response);

    expect(auth.token()).toBe('abc');
    expect(auth.session()?.email).toBe('seven@example.com');
    expect(JSON.parse(localStorage.getItem(storageKey) ?? 'null').token).toBe('abc');
  });

  it('should stay signed out when the credentials are rejected', () => {
    const auth = TestBed.inject(AuthService);
    let failedWith = 0;

    auth.login('seven@example.com', 'wrong').subscribe({ error: error => failedWith = error.status });
    httpMock.expectOne(loginUrl).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(failedWith).toBe(401);
    expect(auth.isAuthenticated()).toBe(false);
  });

  it('should restore a saved session that has not expired', () => {
    const saved: AuthSession = { token: 'saved', expiresAt: Date.now() + 60_000, userId: 3, email: 'three@example.com' };
    localStorage.setItem(storageKey, JSON.stringify(saved));

    expect(TestBed.inject(AuthService).token()).toBe('saved');
  });

  it('should discard a saved session that has expired', () => {
    const saved: AuthSession = { token: 'old', expiresAt: Date.now() - 1, userId: 3, email: 'three@example.com' };
    localStorage.setItem(storageKey, JSON.stringify(saved));

    expect(TestBed.inject(AuthService).session()).toBeNull();
    expect(localStorage.getItem(storageKey)).toBeNull();
  });

  it.each(['not json', 'null', '42', '{"token":1}'])('should discard an unreadable saved session: %s', saved => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    localStorage.setItem(storageKey, saved);

    expect(TestBed.inject(AuthService).session()).toBeNull();
    expect(localStorage.getItem(storageKey)).toBeNull();
  });

  it('should end the session once the token expires', () => {
    const saved: AuthSession = { token: 'soon', expiresAt: Date.now() + 1000, userId: 3, email: 'three@example.com' };
    localStorage.setItem(storageKey, JSON.stringify(saved));
    const auth = TestBed.inject(AuthService);

    vi.spyOn(Date, 'now').mockReturnValue(saved.expiresAt);

    expect(auth.token()).toBeNull();
    expect(auth.session()).toBeNull();
  });

  it('should clear the session on logout', () => {
    const saved: AuthSession = { token: 'saved', expiresAt: Date.now() + 60_000, userId: 3, email: 'three@example.com' };
    localStorage.setItem(storageKey, JSON.stringify(saved));
    const auth = TestBed.inject(AuthService);

    auth.logout();

    expect(auth.session()).toBeNull();
    expect(localStorage.getItem(storageKey)).toBeNull();
  });
});
