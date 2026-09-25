import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { AuthService, LoginResponse } from '../auth/auth.service';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let httpMock: HttpTestingController;
  let startSession: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    startSession = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { startSession } }
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should post the current and new password, then switch to the new token', () => {
    const response: LoginResponse = { Token: 'new-token', ExpiresAt: '2026-01-15T18:00:00Z', UserId: 1, Email: 'one@example.com' };
    let completed = false;

    TestBed.inject(AccountService).changePassword('old-password', 'new-password').subscribe({ complete: () => completed = true });
    const req = httpMock.expectOne(`${environment.APIBaseURL}/User/ChangePassword`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ CurrentPassword: 'old-password', NewPassword: 'new-password' });
    req.flush(response);

    // The API rejects every earlier token after a change, so the session must move to the new one.
    expect(startSession).toHaveBeenCalledWith(response);
    expect(completed).toBe(true);
  });

  it('should register with the email and password, without signing in', () => {
    let completed = false;

    TestBed.inject(AccountService).register('new@example.com', 'long-enough').subscribe({ complete: () => completed = true });
    const req = httpMock.expectOne(`${environment.APIBaseURL}/User/Save`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ Email: 'new@example.com', Password: 'long-enough' });
    req.flush({ Id: 5, Email: 'new@example.com' });

    expect(completed).toBe(true);
    expect(startSession).not.toHaveBeenCalled();
  });
});
