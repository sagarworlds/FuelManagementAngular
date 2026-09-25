import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { FuelDetail, NewFuelDetail } from '../_model/fuel-detail-model';

/**
 * HTTP client for the Web API's `FuelDetail` endpoints.
 */
@Injectable({
  providedIn: 'root'
})
export class FuelService {
  private readonly http = inject(HttpClient);
  readonly APIBaseURL = environment.APIBaseURL;

  /**
   * Creates a fuel log entry.
   * @param oFuelDetail The entry to store.
   * @returns The stored entry, including its server-assigned `Id`.
   */
  save(oFuelDetail: NewFuelDetail): Observable<FuelDetail> {
    const apiURL = `${this.APIBaseURL}/FuelDetail/Save`;
    return this.http.post<FuelDetail>(apiURL, oFuelDetail);
  }

  /**
   * Fetches the signed-in user's fuel log entries.
   * @returns The user's entries.
   */
  getList(): Observable<FuelDetail[]> {
    const apiURL = `${this.APIBaseURL}/FuelDetail/Get`;
    return this.http.get<FuelDetail[]>(apiURL);
  }

  /**
   * Fetches entries for a given month and year.
   * Not used yet: the Web API has no `getByMonthYear` action, so this request currently returns 404.
   * @param oFuelDetail Filter criteria.
   * @returns The matching entries.
   */
  getByMonthYear(oFuelDetail: FuelDetail): Observable<FuelDetail[]> {
    const apiURL = `${this.APIBaseURL}/FuelDetail/getByMonthYear`;
    return this.http.post<FuelDetail[]>(apiURL, oFuelDetail);
  }
}
