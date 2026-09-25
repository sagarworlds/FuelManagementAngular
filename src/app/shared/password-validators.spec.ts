import { FormControl, FormGroup } from '@angular/forms';

import { newPasswordValidators, passwordsMatch } from './password-validators';

describe('password validators', () => {
  const form = (password: string, confirmation: string) => new FormGroup({
    password: new FormControl(password, newPasswordValidators),
    confirmation: new FormControl(confirmation)
  }, { validators: passwordsMatch('password', 'confirmation') });

  it('should accept matching passwords of 8 to 100 characters', () => {
    expect(form('long-enough', 'long-enough').valid).toBe(true);
    expect(form('x'.repeat(100), 'x'.repeat(100)).valid).toBe(true);
  });

  it('should flag different passwords', () => {
    expect(form('long-enough', 'long-enougH').hasError('passwordsDiffer')).toBe(true);
  });

  it.each(['', 'short', 'x'.repeat(101)])('should reject the password "%s"', password => {
    expect(form(password, password).controls.password.valid).toBe(false);
  });
});
