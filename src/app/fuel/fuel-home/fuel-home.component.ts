import { Component, OnInit } from '@angular/core';
import { FuelDetail } from '../_model/fuel-detail-model';
import { FuelService } from '../_service/fuel.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-fuel-home',
  templateUrl: './fuel-home.component.html',
  styleUrls: ['./fuel-home.component.css']
})
export class FuelHomeComponent implements OnInit {

  fuelList: FuelDetail[];
  selectedMonthResult = { month: 0, travelledDistance: 0, year: 0, totalFuel: 0, previousAvg: '', totalPrice: 0.0, PricePerLitre: 0 };
  months = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 1 },
    { name: 'Mar', value: 2 },
    { name: 'Apr', value: 3 },
    { name: 'May', value: 4 },
    { name: 'Jun', value: 5 },
    { name: 'Jul', value: 6 },
    { name: 'Aug', value: 7 },
    { name: 'Sep', value: 8 },
    { name: 'Oct', value: 9 },
    { name: 'Nov', value: 10 },
    { name: 'Dec', value: 11 }
  ];

  now = new Date();
  thisMonth = this.months[this.now.getMonth()];
  selectedInput = { month: { name: this.thisMonth, value: this.now.getMonth() }, year: { name: new Date().getUTCFullYear(), value: new Date().getUTCFullYear() } };

  years = [];
  fuelHomeForm: FormGroup = new FormGroup({
    Month: new FormControl(this.selectedInput.month.value),
    Year: new FormControl(this.selectedInput.year.value)
  });

  constructor(private fuelService: FuelService) { }

  ngOnInit() {
    this.selectedMonthResult.month = this.selectedInput.month.value;
    this.selectedMonthResult.year = this.selectedInput.year.value;
    this.getYears();
    this.getList();
  }


  getList() {
    this.fuelService.GetByUserId(1).subscribe(res => {
      this.fuelList = res;

      this.setFilterData();
    })
  }

  setFilterData() {
    this.selectedMonthResult.travelledDistance = 0;
    this.selectedMonthResult.previousAvg = '';
    this.selectedMonthResult.totalPrice = 0;
    this.selectedMonthResult.totalFuel = 0;
    if (this.fuelList.length) {
      this.fuelList.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())

      let results = this.fuelList.filter(x =>
        new Date(x.CreatedAt).getMonth() == this.selectedInput.month.value
        && new Date(x.CreatedAt).getFullYear() == this.selectedInput.year.value
      );

      if (results.length) {
        for (let i = 0, length = results.length; i < length; i++) {
          const fuel = results[i];
          this.selectedMonthResult.totalPrice += fuel.TotalPrice;
          this.selectedMonthResult.totalFuel += fuel.AddedFuel;
        }
        let index = this.fuelList.indexOf(results[0]);
        let prevRecord = this.fuelList[index + 1];

        this.selectedMonthResult.travelledDistance = results[0].MeterReading - prevRecord.MeterReading;
        // tslint:disable-next-line: max-line-length
        this.selectedMonthResult.previousAvg = (this.selectedMonthResult.travelledDistance / prevRecord.AddedFuel).toFixed(2);
      }
    }

  }

  getYears() {
    let currentYear = new Date().getUTCFullYear();
    for (let index = 0; index < 10; index++) {
      this.years.push({ name: currentYear - index, value: currentYear - index });
    }
  }

  monthChange(newValue: string) {
    console.log(newValue)
    this.selectedInput.month.value = parseInt(newValue);
    //this.selectedMonthResult.month = parseInt(newValue);
    this.setFilterData();
  }
  yearChange(newValue: string) {
    console.log(newValue)
    this.selectedInput.year.value = parseInt(newValue);

    this.setFilterData();
  }


}
