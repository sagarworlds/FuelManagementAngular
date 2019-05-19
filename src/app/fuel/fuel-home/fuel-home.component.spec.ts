import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelHomeComponent } from './fuel-home.component';

describe('FuelHomeComponent', () => {
  let component: FuelHomeComponent;
  let fixture: ComponentFixture<FuelHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
