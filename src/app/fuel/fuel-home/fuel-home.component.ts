import { Component, OnInit } from '@angular/core';
import { FuelDetail } from '../_modal/fuel-detail-modal';
import { FuelService } from '../_service/fuel.service';

@Component({
  selector: 'app-fuel-home',
  templateUrl: './fuel-home.component.html',
  styleUrls: ['./fuel-home.component.css']
})
export class FuelHomeComponent implements OnInit {

  fuelList: FuelDetail[];
  selectedMonthResult = { month: 0, travelledDistance: 0, year: 0, totalFuel: 0, previousAvg: 0, totalPrice: 0.0, PricePerLitre: 0 }
  selectedInput = { month: 4, year: 2019 }
  constructor(private fuelService: FuelService) { }


  ngOnInit() {
    this.selectedMonthResult.month = this.selectedInput.month;
    this.selectedMonthResult.year = this.selectedInput.year;
    this.getList();
  }

  getList() {
    this.fuelService.GetByUserId(1).subscribe(res => {
      console.log(res);
      this.fuelList = res;
      let results = this.fuelList.filter(x =>
        new Date(x.CreatedAt).getMonth() == this.selectedInput.month
        && new Date(x.CreatedAt).getFullYear() == this.selectedInput.year
      );
      results.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
      console.log(results);
      for (let i = 0, length = results.length; i < length; i++) {
        const fuel = results[i];
        this.selectedMonthResult.totalPrice += fuel.TotalPrice;
        this.selectedMonthResult.totalFuel += fuel.AddedFuel;
      }
      this.selectedMonthResult.travelledDistance = results[results.length - 1].MeterReading - results[0].MeterReading;
      console.log(this.selectedMonthResult.travelledDistance)
      console.log(this.selectedMonthResult.totalFuel);
    });
  }


}
