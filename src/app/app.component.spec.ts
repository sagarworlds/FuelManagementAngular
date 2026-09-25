import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthService, AuthSession } from './auth/auth.service';

describe('AppComponent', () => {
  const session = signal<AuthSession | null>(null);
  const logout = vi.fn(() => session.set(null));

  beforeEach(async () => {
    session.set(null);
    logout.mockClear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { session: session.asReadonly(), logout } }
      ]
    }).compileComponents();
  });

  afterEach(() => vi.restoreAllMocks());

  const render = () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('should create the app', () => {
    expect(render().componentInstance).toBeTruthy();
  });

  it(`should have as title 'FuelManagementAngular'`, () => {
    expect(render().componentInstance.title).toEqual('FuelManagementAngular');
  });

  it('should render the brand in the navbar', () => {
    const compiled = render().nativeElement as HTMLElement;
    expect(compiled.querySelector('.navbar-brand')?.textContent).toContain('Fuel Management');
  });

  it('should offer "Log in" and "Register" when signed out', () => {
    const compiled = render().nativeElement as HTMLElement;

    expect(Array.from(compiled.querySelectorAll('.nav-link')).map(link => link.textContent?.trim())).toEqual(['Log in', 'Register']);
  });

  it('should show the pages, the user and "Log out" when signed in, and sign out on click', () => {
    session.set({ token: 't', expiresAt: Date.now() + 60_000, userId: 1, email: 'one@example.com' });
    const fixture = render();
    const compiled = fixture.nativeElement as HTMLElement;
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    expect(compiled.querySelector('.navbar-text')?.textContent).toContain('one@example.com');
    compiled.querySelector<HTMLButtonElement>('nav button.btn')?.click();
    fixture.detectChanges();

    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/login']);
    expect(Array.from(compiled.querySelectorAll('.nav-link')).map(link => link.textContent?.trim())).toEqual(['Log in', 'Register']);
  });
});
