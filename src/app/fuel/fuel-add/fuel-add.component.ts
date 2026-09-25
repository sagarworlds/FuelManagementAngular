import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  fuelAddForm = new FormGroup({
    AddedFuel: new FormControl<number | null>(null, Validators.required),
    MeterReading: new FormControl<number | null>(null, Validators.required),
    TotalPrice: new FormControl<number | null>(null, Validators.required),
    Note: new FormControl<string | null>(null),
    CreatedAt: new FormControl<string | null>(null)
  });

  /** Saves the entry when the form is valid, then clears the form. */
  onSubmit() {
    if (this.fuelAddForm.valid) {
      // The required validators guarantee the non-null fields are set once the form is valid.
      const newFuelDetail = this.fuelAddForm.getRawValue() as NewFuelDetail;
      console.log(newFuelDetail);
      this.fuelService.save(newFuelDetail).subscribe(res => {
        console.log(res);
        this.fuelAddForm.reset();
        // OnPush (Angular's default) doesn't re-render after async callbacks on its own.
        this.changeDetector.markForCheck();
      });
    }
  }
}
