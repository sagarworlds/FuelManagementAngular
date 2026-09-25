import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { FuelDetail } from '../_model/fuel-detail-model';
import { FuelHomeComponent } from './fuel-home.component';

describe('FuelHomeComponent', () => {
  let component: FuelHomeComponent;
  let fixture: ComponentFixture<FuelHomeComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelHomeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(FuelHomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should create and load the signed-in user\'s entries', () => {
    expect(component).toBeTruthy();
    httpMock.expectOne(`${environment.APIBaseURL}/FuelDetail/Get`).flush([]);
  });

  it('should render the selected month\'s totals once entries load', () => {
    const now = new Date();
    const earlier = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000);
    const entries: FuelDetail[] = [
      { Id: 2, UserId: 1, MeterReading: 1500, TotalPrice: 1000, AddedFuel: 10, Note: null,
        CreatedAt: now.toISOString(), ModifiedAt: now.toISOString() },
      { Id: 1, UserId: 1, MeterReading: 1000, TotalPrice: 2000, AddedFuel: 20, Note: null,
        CreatedAt: earlier.toISOString(), ModifiedAt: earlier.toISOString() }
    ];

    httpMock.expectOne(`${environment.APIBaseURL}/FuelDetail/Get`).flush(entries);
    fixture.detectChanges();

    const circles = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.circle'))
      .map(circle => circle.textContent?.trim());
    // Distance is from the previous fill-up (1500 - 1000); mileage divides it by that fill-up's 20 litres.
    expect(circles).toEqual(['₹1,000.00', '10ltr', '25.00', '500km']);
  });

  it('should show zero distance, not crash, for the month of the oldest entry', () => {
    const now = new Date();
    const earlier = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000);
    httpMock.expectOne(`${environment.APIBaseURL}/FuelDetail/Get`).flush([
      { Id: 2, UserId: 1, MeterReading: 1500, TotalPrice: 1000, AddedFuel: 10, Note: null,
        CreatedAt: now.toISOString(), ModifiedAt: now.toISOString() },
      { Id: 1, UserId: 1, MeterReading: 1000, TotalPrice: 2000, AddedFuel: 20, Note: null,
        CreatedAt: earlier.toISOString(), ModifiedAt: earlier.toISOString() }
    ]);

    component.yearChange(String(earlier.getFullYear()));
    component.monthChange(String(earlier.getMonth()));
    fixture.detectChanges();

    const circles = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.circle'))
      .map(circle => circle.textContent?.trim());
    expect(circles).toEqual(['₹2,000.00', '20ltr', '0', '0km']);
  });

  it('should explain when the entries can\'t be loaded', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    httpMock.expectOne(`${environment.APIBaseURL}/FuelDetail/Get`).flush(null, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.alert-danger')?.textContent)
      .toContain('Couldn\'t load your fuel entries.');
  });

  it('should list the current year and the nine before it', () => {
    httpMock.expectOne(`${environment.APIBaseURL}/FuelDetail/Get`).flush([]);
    const currentYear = new Date().getFullYear();

    expect(component.years.length).toBe(10);
    expect(component.years[0].value).toBe(currentYear);
    expect(component.years[9].value).toBe(currentYear - 9);
  });
});
