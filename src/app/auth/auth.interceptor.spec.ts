import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { environment } from '../../environments/environment';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  const apiUrl = `${environment.APIBaseURL}/FuelDetail/Get`;
  let token: string | null;
  let logout: ReturnType<typeof vi.fn>;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    token = 'abc';
    logout = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { token: () => token, logout } }
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should send the bearer token to the Web API', () => {
    http.get(apiUrl).subscribe();

    expect(httpMock.expectOne(apiUrl).request.headers.get('Authorization')).toBe('Bearer abc');
  });

  it('should not send the token to other hosts', () => {
    http.get('https://example.com/data').subscribe();

    expect(httpMock.expectOne('https://example.com/data').request.headers.has('Authorization')).toBe(false);
  });

  it('should send no Authorization header when signed out', () => {
    token = null;

    http.get(apiUrl).subscribe();

    expect(httpMock.expectOne(apiUrl).request.headers.has('Authorization')).toBe(false);
  });

  it('should sign out and go to login when the API rejects the token', () => {
    let status = 0;

    http.get(apiUrl).subscribe({ error: error => status = error.status });
    httpMock.expectOne(apiUrl).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(status).toBe(401);
    expect(logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/' } });
  });

  it('should leave a 401 without a token (a failed login) to the caller', () => {
    token = null;

    http.post(`${environment.APIBaseURL}/User/Login`, {}).subscribe({ error: () => undefined });
    httpMock.expectOne(`${environment.APIBaseURL}/User/Login`).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(logout).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
