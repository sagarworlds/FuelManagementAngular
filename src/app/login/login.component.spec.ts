import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let loginResult: () => Observable<void>;
  let login: ReturnType<typeof vi.fn>;
  let returnUrl: string | null;

  const createComponent = () => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const submit = (email = 'one@example.com', password = 'secret') => {
    component.loginForm.setValue({ email, password });
    component.onSubmit();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    loginResult = () => of(undefined);
    login = vi.fn(() => loginResult());
    returnUrl = null;

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { login } },
        {
          provide: ActivatedRoute,
          useFactory: () => ({ snapshot: { queryParamMap: convertToParamMap(returnUrl ? { returnUrl } : {}) } })
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  afterEach(() => vi.restoreAllMocks());

  it('should not submit an incomplete form', () => {
    createComponent();

    submit('not-an-email', '');

    expect(login).not.toHaveBeenCalled();
  });

  it('should sign in and go to the requested page', () => {
    returnUrl = '/list';
    createComponent();

    submit();

    expect(login).toHaveBeenCalledWith('one@example.com', 'secret');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/list');
  });

  it.each(['//evil.example', 'https://evil.example', '/\\evil.example', '/login'])(
    'should go home instead of the unsafe return URL %s', unsafe => {
      returnUrl = unsafe;
      createComponent();

      submit();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
    });

  it('should explain rejected credentials', () => {
    loginResult = () => throwError(() => new HttpErrorResponse({ status: 401 }));
    createComponent();

    submit();

    expect((fixture.nativeElement as HTMLElement).querySelector('.alert')?.textContent).toContain('Email or password is incorrect.');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should report other failures without blaming the credentials', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loginResult = () => throwError(() => new HttpErrorResponse({ status: 0 }));
    createComponent();

    submit();

    expect((fixture.nativeElement as HTMLElement).querySelector('.alert')?.textContent).toContain('Can\'t reach the server');
    expect(component.submitting()).toBe(false);
  });
});
