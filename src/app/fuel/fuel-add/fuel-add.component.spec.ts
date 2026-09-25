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

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not save while required fields are empty, and show what is missing', () => {
    component.onSubmit();
    fixture.detectChanges();

    httpMock.expectNone(`${environment.APIBaseURL}/FuelDetail/Save`);
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('.alert-danger:not([hidden])').length).toBe(4);
  });

  const fillValidEntry = () => {
    component.fuelAddForm.setValue({
      AddedFuel: 5, MeterReading: 1000, TotalPrice: 500, Note: null, CreatedAt: '2026-01-15'
    });
    fixture.detectChanges();
  };
  const saveUrl = `${environment.APIBaseURL}/FuelDetail/Save`;
  const page = () => fixture.nativeElement as HTMLElement;

  it('should send the date as a UTC instant, without a UserId, and confirm the save', () => {
    fillValidEntry();

    component.onSubmit();

    const req = httpMock.expectOne(saveUrl);
    // The API takes the user from the token and stores dates in UTC.
    expect(req.request.body).toEqual({
      AddedFuel: 5, MeterReading: 1000, TotalPrice: 500, Note: null, CreatedAt: new Date(2026, 0, 15).toISOString()
    });
    req.flush({});
    fixture.detectChanges();
    expect(component.fuelAddForm.controls.TotalPrice.value).toBeNull();
    expect(page().querySelector('.alert-success')?.textContent).toContain('Entry saved.');
  });

  it.each([
    ['TotalPrice', 0],
    ['AddedFuel', -1],
    ['MeterReading', 0],
    ['MeterReading', 10.5]
  ] as const)('should not save when %s is %s', (field, value) => {
    fillValidEntry();
    component.fuelAddForm.controls[field].setValue(value);

    component.onSubmit();

    httpMock.expectNone(saveUrl);
  });

  it('should show the API\'s validation messages and keep the values', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fillValidEntry();

    component.onSubmit();
    httpMock.expectOne(saveUrl).flush(
      { Message: 'The request is invalid.', ModelState: { 'oFuelDetail.CreatedAt': ['CreatedAt cannot be in the future.'] } },
      { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    expect(page().querySelector('.alert-danger:not([hidden])')?.textContent).toContain('CreatedAt cannot be in the future.');
    expect(component.fuelAddForm.controls.TotalPrice.value).toBe(500);
  });

  it('should not send a second request while the first is saving', () => {
    fillValidEntry();

    component.onSubmit();
    component.onSubmit();

    httpMock.expectOne(saveUrl).flush({});
  });
});
