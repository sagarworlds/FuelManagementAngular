import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { describeHttpError } from '../../shared/http-error-message';
import { localDateToUtcIso, todayForDateInput } from '../../shared/local-date';
import { NewFuelDetail } from '../_model/fuel-detail-model';
import { FuelService } from '../_service/fuel.service';

/**
 * Form for recording a new fuel fill-up.
 */
@Component({
  selector: 'app-fuel-add',
  imports: [ReactiveFormsModule],
  templateUrl: './fuel-add.component.html',
  styleUrls: ['./fuel-add.component.css']
})
export class FuelAddComponent {
  private readonly fuelService = inject(FuelService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  // Mirrors the API's rules, so most mistakes are caught before a round trip.
  fuelAddForm = new FormGroup({
    AddedFuel: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    MeterReading: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]),
    TotalPrice: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    Note: new FormControl<string | null>(null, Validators.maxLength(1000)),
    CreatedAt: new FormControl<string | null>(null, Validators.required)
  });
  readonly today = todayForDateInput();
  saving = false;
  saveError: string | null = null;
  saved = false;

  /** Saves the entry when the form is valid, then clears the form; on failure keeps the values and shows why. */
  onSubmit() {
    if (this.fuelAddForm.invalid || this.saving) {
      this.fuelAddForm.markAllAsDirty();
      return;
    }

    // The validators guarantee the non-null fields are set once the form is valid.
    const value = this.fuelAddForm.getRawValue();
    const newFuelDetail = { ...value, CreatedAt: localDateToUtcIso(value.CreatedAt as string) } as NewFuelDetail;
    this.saving = true;
    this.saveError = null;
    this.saved = false;
    this.fuelService.save(newFuelDetail).subscribe({
      next: () => {
        this.saving = false;
        this.saved = true;
        this.fuelAddForm.reset();
        // OnPush (Angular's default) doesn't re-render after async callbacks on its own.
        this.changeDetector.markForCheck();
      },
      error: (error: unknown) => {
        this.saving = false;
        this.saveError = describeHttpError(error, 'Couldn\'t save the entry. Please try again.');
        if (this.saveError) {
          console.error('Saving a fuel entry failed.', error);
        }
        this.changeDetector.markForCheck();
      }
    });
  }
}
