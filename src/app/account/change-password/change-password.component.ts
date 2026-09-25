import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { describeHttpError } from '../../shared/http-error-message';
import { newPasswordValidators, passwordsMatch } from '../../shared/password-validators';
import { AccountService } from '../account.service';

/**
 * Lets the signed-in user replace their password.
 */
@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  private readonly account = inject(AccountService);

  readonly form = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    newPassword: new FormControl('', { nonNullable: true, validators: newPasswordValidators }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: Validators.required })
  }, { validators: passwordsMatch('newPassword', 'confirmPassword') });
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly changed = signal(false);

  /** Submits the change when the form is valid. */
  onSubmit() {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.form.getRawValue();
    this.saving.set(true);
    this.errorMessage.set(null);
    this.changed.set(false);
    this.account.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.saving.set(false);
        this.changed.set(true);
        this.form.reset();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        const message = describeHttpError(error, 'Couldn\'t change the password. Please try again.');
        if (message) {
          console.error('Changing the password failed.', error);
        }
        this.errorMessage.set(message);
      }
    });
  }
}
