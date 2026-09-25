import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { describeHttpError } from '../shared/http-error-message';

/**
 * Sign-in form; on success returns the user to the page they were sent here from.
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required })
  });
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  /** Signs in with the entered credentials. */
  onSubmit() {
    if (this.loginForm.invalid || this.submitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.submitting.set(true);
    this.errorMessage.set(null);
    this.auth.login(email, password).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl(this.returnUrl());
      },
      error: (error: unknown) => {
        this.submitting.set(false);
        this.errorMessage.set(this.describe(error));
      }
    });
  }

  /**
   * The page to go to after signing in. Only app-relative paths are accepted, so a crafted
   * link can't send the user to another site (e.g. `?returnUrl=//evil.example`).
   */
  private returnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const isAppPath = returnUrl !== null && returnUrl.startsWith('/') && !returnUrl.startsWith('//')
      && !returnUrl.startsWith('/\\') && !returnUrl.startsWith('/login');
    return isAppPath ? returnUrl : '/home';
  }

  private describe(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      return 'Email or password is incorrect.';
    }
    console.error('Login failed.', error);
    const fallback = 'Could not sign in. Please try again.';
    return describeHttpError(error, fallback) ?? fallback;
  }
}
