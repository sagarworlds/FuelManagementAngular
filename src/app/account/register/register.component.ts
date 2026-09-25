import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { describeHttpError } from '../../shared/http-error-message';
import { newPasswordValidators, passwordsMatch } from '../../shared/password-validators';
import { AccountService } from '../account.service';

/**
 * Sign-up form; creates the account, signs the user in and goes to the dashboard.
 */
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly account = inject(AccountService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Mirrors the API's rules: a valid email of at most 254 characters, and an 8 to 100 character password.
  readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(254)] }),
    password: new FormControl('', { nonNullable: true, validators: newPasswordValidators }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: Validators.required })
  }, { validators: passwordsMatch('password', 'confirmPassword') });
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  /** Creates the account and signs in with it. */
  onSubmit() {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    let created = false;
    this.submitting.set(true);
    this.errorMessage.set(null);
    this.account.register(email, password).pipe(
      tap(() => created = true),
      switchMap(() => this.auth.login(email, password))
    ).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/home');
      },
      error: (error: unknown) => {
        this.submitting.set(false);
        this.errorMessage.set(created
          ? 'Your account was created, but signing in failed. Please sign in.'
          : this.describe(error));
      }
    });
  }

  private describe(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 409) {
      return 'An account with this email already exists. Sign in instead.';
    }
    console.error('Registration failed.', error);
    const fallback = 'Couldn\'t create the account. Please try again.';
    return describeHttpError(error, fallback) ?? fallback;
  }
}
