import { Component, OnInit } from '@angular/core';
import { FuelService } from '../_service/fuel.service';

@Component({
  selector: 'app-fuel-add',
  templateUrl: './fuel-add.component.html',
  styleUrls: ['./fuel-add.component.css']
})
export class FuelAddComponent implements OnInit {
   fueldetail: FuelDetail = { AddedFuel: '', MeterReading: 0, TotalPrice: 0, UserId: 1, Note: '' };
  constructor(private _service: FuelService) { }

  ngOnInit() {
    
  }

  save() {
    debugger;
    this._service.save(this.fueldetail).subscribe(res => {
      debugger;
      this.fueldetail = res;
      console.log(this.fueldetail);
    });
  }

}
