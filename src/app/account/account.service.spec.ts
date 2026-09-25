import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should post the current and new password', () => {
    let completed = false;

    TestBed.inject(AccountService).changePassword('old-password', 'new-password').subscribe({ complete: () => completed = true });
    const req = httpMock.expectOne(`${environment.APIBaseURL}/User/ChangePassword`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ CurrentPassword: 'old-password', NewPassword: 'new-password' });
    req.flush(null, { status: 204, statusText: 'No Content' });

    expect(completed).toBe(true);
  });
});
