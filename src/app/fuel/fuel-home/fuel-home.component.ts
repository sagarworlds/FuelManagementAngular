import { CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { describeHttpError } from '../../shared/http-error-message';
import { FuelDetail } from '../_model/fuel-detail-model';
import { FuelService } from '../_service/fuel.service';

/**
 * Dashboard with the selected month's spend, fuel, mileage and distance.
 */
@Component({
  selector: 'app-fuel-home',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './fuel-home.component.html',
  styleUrls: ['./fuel-home.component.css']
})
export class FuelHomeComponent implements OnInit {
  private readonly fuelService = inject(FuelService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  fuelList: FuelDetail[] = [];
  loadError: string | null = null;
  selectedMonthResult = { month: 0, travelledDistance: 0, year: 0, totalFuel: 0, previousAvg: '', totalPrice: 0.0, PricePerLitre: 0 };
  months = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 1 },
    { name: 'Mar', value: 2 },
    { name: 'Apr', value: 3 },
    { name: 'May', value: 4 },
    { name: 'Jun', value: 5 },
    { name: 'Jul', value: 6 },
    { name: 'Aug', value: 7 },
    { name: 'Sep', value: 8 },
    { name: 'Oct', value: 9 },
    { name: 'Nov', value: 10 },
    { name: 'Dec', value: 11 }
  ];

  now = new Date();
  thisMonth = this.months[this.now.getMonth()];
  // Local-time year, matching the local-time month here and in setFilterData().
  selectedInput = { month: { name: this.thisMonth, value: this.now.getMonth() }, year: { name: this.now.getFullYear(), value: this.now.getFullYear() } };

  years: { name: number; value: number }[] = [];
  fuelHomeForm: FormGroup = new FormGroup({
    Month: new FormControl(this.selectedInput.month.value),
    Year: new FormControl(this.selectedInput.year.value)
  });

  ngOnInit() {
    this.selectedMonthResult.month = this.selectedInput.month.value;
    this.selectedMonthResult.year = this.selectedInput.year.value;
    this.getYears();
    this.getList();
  }


  /** Loads the signed-in user's entries and recalculates the summary. */
  getList() {
    this.loadError = null;
    this.fuelService.getList().subscribe({
      next: res => {
        this.fuelList = res;

        this.setFilterData();
        // OnPush (Angular's default) doesn't re-render after async callbacks on its own.
        this.changeDetector.markForCheck();
      },
      error: (error: unknown) => {
        this.loadError = describeHttpError(error, 'Couldn\'t load your fuel entries. Please try again.');
        if (this.loadError) {
          console.error('Loading fuel entries failed.', error);
        }
        this.changeDetector.markForCheck();
      }
    });
  }

  /** Recalculates the summary figures for the selected month and year. */
  setFilterData() {
    this.selectedMonthResult.travelledDistance = 0;
    this.selectedMonthResult.previousAvg = '';
    this.selectedMonthResult.totalPrice = 0;
    this.selectedMonthResult.totalFuel = 0;
    if (this.fuelList.length) {
      this.fuelList.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())

      const results = this.fuelList.filter(x =>
        new Date(x.CreatedAt).getMonth() == this.selectedInput.month.value
        && new Date(x.CreatedAt).getFullYear() == this.selectedInput.year.value
      );

      if (results.length) {
        for (let i = 0, length = results.length; i < length; i++) {
          const fuel = results[i];
          this.selectedMonthResult.totalPrice += fuel.TotalPrice;
          this.selectedMonthResult.totalFuel += fuel.AddedFuel;
        }
        const index = this.fuelList.indexOf(results[0]);
        const prevRecord: FuelDetail | undefined = this.fuelList[index + 1];

        // The oldest entry has no earlier fill-up to measure from, so distance and mileage stay 0.
        if (prevRecord) {
          this.selectedMonthResult.travelledDistance = results[0].MeterReading - prevRecord.MeterReading;
          this.selectedMonthResult.previousAvg = (this.selectedMonthResult.travelledDistance / prevRecord.AddedFuel).toFixed(2);
        }
      }
    }

  }

  /** Fills the year dropdown with the current year and the nine before it. */
  getYears() {
    const currentYear = new Date().getFullYear();
    for (let index = 0; index < 10; index++) {
      this.years.push({ name: currentYear - index, value: currentYear - index });
    }
  }

  /** Handles a month selection; `newValue` is the selected option's value (0-11). */
  monthChange(newValue: string) {
    console.log(newValue)
    this.selectedInput.month.value = parseInt(newValue);
    //this.selectedMonthResult.month = parseInt(newValue);
    this.setFilterData();
  }
  /** Handles a year selection; `newValue` is the selected four-digit year. */
  yearChange(newValue: string) {
    console.log(newValue)
    this.selectedInput.year.value = parseInt(newValue);

    this.setFilterData();
  }


}
