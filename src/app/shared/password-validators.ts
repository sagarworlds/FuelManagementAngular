import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

/** The API's rule for new passwords: 8 to 100 characters. */
export const newPasswordValidators: ValidatorFn[] = [Validators.required, Validators.minLength(8), Validators.maxLength(100)];

/**
 * Group validator that flags `passwordsDiffer` when two of the group's controls hold different values.
 * @param passwordKey The control with the password.
 * @param confirmationKey The control where it is typed again.
 */
export function passwordsMatch(passwordKey: string, confirmationKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null =>
    group.get(passwordKey)?.value === group.get(confirmationKey)?.value ? null : { passwordsDiffer: true };
}
