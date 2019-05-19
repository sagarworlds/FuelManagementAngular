import { Component, OnInit } from '@angular/core';
import { FuelService } from '../_service/fuel.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FuelDetail } from '../_modal/fuel-detail-modal';

@Component({
  selector: 'app-fuel-add',
  templateUrl: './fuel-add.component.html',
  styleUrls: ['./fuel-add.component.css']
})
export class FuelAddComponent implements OnInit {

  fuelAddForm = new FormGroup({
    AddedFuel: new FormControl('', Validators.required),
    MeterReading: new FormControl('', Validators.required),
    TotalPrice: new FormControl('', Validators.required),
    UserId: new FormControl(1),
    Note: new FormControl()
  });
  newFuelDetail: FuelDetail;

  constructor(private fuelService: FuelService) { }


  ngOnInit() {

  }

  onSubmit() {
    if (this.fuelAddForm.valid) {
      this.newFuelDetail = new FuelDetail(this.fuelAddForm.value);
      console.log(this.newFuelDetail);
      this.fuelService.save(this.newFuelDetail).subscribe(res => {
        debugger;
        console.log(res);
        this.fuelAddForm.reset();
      });
    }
  }
}
