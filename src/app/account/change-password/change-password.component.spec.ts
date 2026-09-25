import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { AccountService } from '../account.service';
import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let result: () => Observable<void>;
  let changePassword: ReturnType<typeof vi.fn>;

  const page = () => fixture.nativeElement as HTMLElement;
  const submit = (currentPassword: string, newPassword: string, confirmPassword = newPassword) => {
    component.form.setValue({ currentPassword, newPassword, confirmPassword });
    component.onSubmit();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    result = () => of(undefined);
    changePassword = vi.fn(() => result());
    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponent],
      providers: [{ provide: AccountService, useValue: { changePassword } }]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should change the password and clear the form', () => {
    submit('old-password', 'new-password');

    expect(changePassword).toHaveBeenCalledWith('old-password', 'new-password');
    expect(page().querySelector('.alert-success')?.textContent).toContain('Password changed.');
    expect(component.form.getRawValue()).toEqual({ currentPassword: '', newPassword: '', confirmPassword: '' });
  });

  it('should not submit when the confirmation differs', () => {
    submit('old-password', 'new-password', 'other-password');

    expect(changePassword).not.toHaveBeenCalled();
    expect(page().textContent).toContain('The passwords don\'t match.');
  });

  it('should not submit a new password shorter than 8 characters', () => {
    submit('old-password', 'short');

    expect(changePassword).not.toHaveBeenCalled();
    expect(page().textContent).toContain('Use 8 to 100 characters.');
  });

  it('should show the API\'s reason when the current password is wrong', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    result = () => throwError(() => new HttpErrorResponse({ status: 400, error: { Message: 'The current password is incorrect.' } }));

    submit('wrong-password', 'new-password');

    expect(page().querySelector('.alert-danger')?.textContent).toContain('The current password is incorrect.');
    expect(component.saving()).toBe(false);
  });
});
