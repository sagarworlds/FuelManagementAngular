import { Component, OnInit } from '@angular/core';
import { FuelService } from '../_service/fuel.service';
import { FuelDetail } from '../_modal/fuel-detail-modal';

@Component({
  selector: 'app-fuel-list',
  templateUrl: './fuel-list.component.html',
  styleUrls: ['./fuel-list.component.css']
})
export class FuelListComponent implements OnInit {
  fuelList: FuelDetail[];
  constructor(private _service: FuelService) { }


  ngOnInit() {
    this.getList();
  }

  getList() {
    this._service.getList().subscribe(res => {
      console.log(res);
      this.fuelList = res;
    });
  }

}
