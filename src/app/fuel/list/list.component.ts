import { Component, OnInit } from '@angular/core';
import { FuelService } from '../_service/fuel.service';
import { FuelDetail } from '../_modal/fuel-detail-modal';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
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
