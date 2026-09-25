import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let signedIn: boolean;

  const runGuard = (url: string) => TestBed.runInInjectionContext(
    () => authGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot));

  beforeEach(() => {
    signedIn = false;
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isAuthenticated: () => signedIn } }
      ]
    });
  });

  it('should let a signed-in user through', () => {
    signedIn = true;

    expect(runGuard('/list')).toBe(true);
  });

  it('should send a signed-out user to login, remembering the page they asked for', () => {
    const result = runGuard('/list');

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Flist');
  });
});
