import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { describeHttpError } from '../../shared/http-error-message';
import { AccountService } from '../account.service';

/** Flags the form when the new password and its confirmation differ. */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const { newPassword, confirmPassword } = (group as ChangePasswordForm).getRawValue();
  return newPassword === confirmPassword ? null : { passwordsDiffer: true };
}

type ChangePasswordForm = FormGroup<{
  currentPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}>;

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

  // Mirrors the API's rule for new passwords (8 to 100 characters).
  readonly form: ChangePasswordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)]
    }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: Validators.required })
  }, { validators: passwordsMatch });
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
