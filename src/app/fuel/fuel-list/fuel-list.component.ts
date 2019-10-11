import { Component, OnInit } from '@angular/core';
import { FuelService } from '../_service/fuel.service';
import { FuelDetail } from '../_model/fuel-detail-model';
import { OrderByPipe } from 'src/app/pipe/OrderByPipe';

@Component({
  selector: 'app-fuel-list',
  templateUrl: './fuel-list.component.html',
  styleUrls: ['./fuel-list.component.css']

})

export class FuelListComponent implements OnInit {
  fuelList: FuelDetail[];
  order = "Id";
  ascending = false;
  constructor(private fuelService: FuelService) { }


  ngOnInit() {
    this.getList();
  }

  getList() {
    this.fuelService.getList().subscribe(res => {
      console.log(res);
      this.fuelList = res;
    });
  }
}

