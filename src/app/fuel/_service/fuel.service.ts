import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { FuelDetail } from '../_modal/fuel-detail-modal';


@Injectable({
  providedIn: 'root'
})
export class FuelService {
  APIBaseURL = environment.APIBaseURL;

  constructor(private http: HttpClient) { }

  save(oFuelDetail: FuelDetail): Observable<any> {
    const apiURL = `${this.APIBaseURL}/FuelDetail/Save`;
    return this.http.post(apiURL, oFuelDetail);
  }

  getList(): Observable<any> {
    const apiURL = `${this.APIBaseURL}/FuelDetail/Get`;
    return this.http.get(apiURL);
  }

  getByMonthYear(oFuelDetail: FuelDetail): Observable<any> {
    const apiURL = `${this.APIBaseURL}/FuelDetail/getByMonthYear`;
    return this.http.post(apiURL, oFuelDetail);
  }
  
  GetByUserId(userId): Observable<any> {
    const apiURL = `${this.APIBaseURL}/FuelDetail/GetByUserId?UserId=${userId}`;
    return this.http.get(apiURL);
  }

 
}
