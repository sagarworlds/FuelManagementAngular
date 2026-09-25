import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { FuelAddComponent } from './fuel-add.component';

describe('FuelAddComponent', () => {
  let component: FuelAddComponent;
  let fixture: ComponentFixture<FuelAddComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelAddComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(FuelAddComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not save while required fields are empty', () => {
    component.onSubmit();

    httpMock.expectNone(`${environment.APIBaseURL}/FuelDetail/Save`);
  });

  it('should save the entry and keep UserId 1 after the form resets', () => {
    component.fuelAddForm.setValue({
      AddedFuel: 5, MeterReading: 1000, TotalPrice: 500, UserId: 1, Note: null, CreatedAt: '2026-01-15'
    });
    fixture.detectChanges();

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.APIBaseURL}/FuelDetail/Save`);
    expect(req.request.body.UserId).toBe(1);
    req.flush({});
    expect(component.fuelAddForm.controls.UserId.value).toBe(1);
    expect(component.fuelAddForm.controls.TotalPrice.value).toBeNull();
  });
});
