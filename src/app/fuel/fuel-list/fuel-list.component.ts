import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { OrderByPipe } from '../../pipe/OrderByPipe';
import { describeHttpError } from '../../shared/http-error-message';
import { FuelDetail } from '../_model/fuel-detail-model';
import { FuelService } from '../_service/fuel.service';

/**
 * Table of the signed-in user's fuel log entries, newest `Id` first.
 */
@Component({
  selector: 'app-fuel-list',
  imports: [DatePipe, OrderByPipe],
  templateUrl: './fuel-list.component.html',
  styleUrls: ['./fuel-list.component.css']

})

export class FuelListComponent implements OnInit {
  private readonly fuelService = inject(FuelService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  fuelList: FuelDetail[] = [];
  loadError: string | null = null;
  order: keyof FuelDetail = 'Id';
  ascending = false;


  ngOnInit() {
    this.getList();
  }

  /** Loads all entries from the API. */
  getList() {
    this.loadError = null;
    this.fuelService.getList().subscribe({
      next: res => {
        this.fuelList = res;
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
}
