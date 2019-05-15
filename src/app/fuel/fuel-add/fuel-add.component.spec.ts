import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelAddComponent } from './fuel-add.component';

describe('FuelAddComponent', () => {
  let component: FuelAddComponent;
  let fixture: ComponentFixture<FuelAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
