import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { NewFuelDetail } from '../_model/fuel-detail-model';
import { FuelService } from './fuel.service';

describe('FuelService', () => {
  const baseUrl = environment.APIBaseURL;
  let service: FuelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(FuelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST a new entry to FuelDetail/Save', () => {
    const entry: NewFuelDetail = {
      MeterReading: 1000, TotalPrice: 500, AddedFuel: 5, Note: null, CreatedAt: '2026-01-15'
    };

    service.save(entry).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/FuelDetail/Save`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(entry);
    req.flush({ ...entry, Id: 1, UserId: 1, ModifiedAt: entry.CreatedAt });
  });

  it('should GET the signed-in user\'s entries from FuelDetail/Get', () => {
    service.getList().subscribe();

    const req = httpMock.expectOne(`${baseUrl}/FuelDetail/Get`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
