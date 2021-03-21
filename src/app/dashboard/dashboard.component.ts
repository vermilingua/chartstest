import { Component, OnInit } from '@angular/core';
import { SeriesDataService } from '../services/series-data.service'
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private service: SeriesDataService, private route: ActivatedRoute) { }
  stationsData: any[];
  access_okay = false;

  ngOnInit(): void {
    let location = this.route.snapshot.queryParams.location;
    let fuelType = this.route.snapshot.queryParams.fuelType;
    let accessCode = this.route.snapshot.queryParams.accessCode;

    if(accessCode=="goethe49!"){
      this.access_okay = true;
      this.loadData(location, fuelType);
    }

  }

  loadData(location, fuelType) {
    this.service.changeMessage(location + "_" + fuelType);
  }

}
