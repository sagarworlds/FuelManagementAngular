import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { FuelDetail } from '../_model/fuel-detail-model';
import { FuelListComponent } from './fuel-list.component';

describe('FuelListComponent', () => {
  let component: FuelListComponent;
  let fixture: ComponentFixture<FuelListComponent>;
  let httpMock: HttpTestingController;

  const entry = (Id: number, TotalPrice: number): FuelDetail => ({
    Id, TotalPrice, UserId: 1, MeterReading: 1000 + Id, AddedFuel: 5, Note: null,
    CreatedAt: '2026-01-15T00:00:00', ModifiedAt: '2026-01-15T00:00:00'
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(FuelListComponent);
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
    httpMock.expectOne(`${environment.APIBaseURL}/FuelDetail/Get`).flush([]);
  });

  it('should explain when the entries can\'t be loaded', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    httpMock.expectOne(`${environment.APIBaseURL}/FuelDetail/Get`).flush(null, { status: 0, statusText: 'Unknown Error' });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.alert-danger')?.textContent)
      .toContain('Can\'t reach the server');
  });

  it('should render entries newest Id first', () => {
    httpMock.expectOne(`${environment.APIBaseURL}/FuelDetail/Get`)
      .flush([entry(1, 100), entry(3, 300), entry(2, 200)]);
    fixture.detectChanges();

    const firstCells = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr td:first-child'))
      .map(cell => cell.textContent?.trim());
    expect(firstCells).toEqual(['300', '200', '100']);
  });
});
