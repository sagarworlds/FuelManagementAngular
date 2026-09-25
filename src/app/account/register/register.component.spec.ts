import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { AccountService } from '../account.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerResult: () => Observable<void>;
  let loginResult: () => Observable<void>;
  let register: ReturnType<typeof vi.fn>;
  let login: ReturnType<typeof vi.fn>;
  let router: Router;

  const page = () => fixture.nativeElement as HTMLElement;
  const submit = (email: string, password: string, confirmPassword = password) => {
    component.form.setValue({ email, password, confirmPassword });
    component.onSubmit();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    registerResult = () => of(undefined);
    loginResult = () => of(undefined);
    register = vi.fn(() => registerResult());
    login = vi.fn(() => loginResult());
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AccountService, useValue: { register } },
        { provide: AuthService, useValue: { login } }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should create the account, sign in with it and go to the dashboard', () => {
    submit('new@example.com', 'long-enough');

    expect(register).toHaveBeenCalledWith('new@example.com', 'long-enough');
    expect(login).toHaveBeenCalledWith('new@example.com', 'long-enough');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it.each([
    ['not-an-email', 'long-enough', 'long-enough'],
    ['new@example.com', 'short', 'short'],
    ['new@example.com', 'long-enough', 'different-one']
  ])('should not submit %s / %s / %s', (email, password, confirmation) => {
    submit(email, password, confirmation);

    expect(register).not.toHaveBeenCalled();
  });

  it('should say when the email is already registered', () => {
    registerResult = () => throwError(() => new HttpErrorResponse({ status: 409 }));

    submit('one@example.com', 'long-enough');

    expect(page().querySelector('.alert-danger')?.textContent).toContain('An account with this email already exists.');
    expect(login).not.toHaveBeenCalled();
    expect(component.submitting()).toBe(false);
  });

  it('should show the API\'s validation messages', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    registerResult = () => throwError(() => new HttpErrorResponse({
      status: 400, error: { Message: 'The request is invalid.', ModelState: { 'oUser.Email': ['Email must be a valid email address.'] } }
    }));

    submit('odd@example.com', 'long-enough');

    expect(page().querySelector('.alert-danger')?.textContent).toContain('Email must be a valid email address.');
  });

  it('should ask the user to sign in when the account was created but signing in failed', () => {
    loginResult = () => throwError(() => new HttpErrorResponse({ status: 0 }));

    submit('new@example.com', 'long-enough');

    expect(page().querySelector('.alert-danger')?.textContent).toContain('Your account was created, but signing in failed.');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
