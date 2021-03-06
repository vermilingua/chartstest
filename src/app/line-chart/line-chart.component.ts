import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SeriesDataService } from '../services/series-data.service'
import { Subscription } from 'rxjs';
import { FuelPriceData } from '../interfaces/fuelprice-data'

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

/*
https://stackoverflow.com/questions/50982006/display-date-label-in-axes-chart-js-ng2-charts
*/


export class LineChartComponent implements OnInit{

  constructor(private service: SeriesDataService) {

  }

  message: FuelPriceData;
  subscription: Subscription;

  private x = [];
  private y = [];
  private z = [];
  private u = [];
  private v = [];

  transform_series(series: any[]) {

    let data = [];

    if(series.length < 1){
      return data;
    }

    for (var i = 0; i < series.length; i++) {
      
       data.push({ x: new Date('1970-01-01 ' + series[i][0]), y: series[i][1] });
    }
    data.push({ x: new Date('1970-01-01 21:00:00'), y: series[series.length - 1][1] });

    return data;
  
  }

  ngOnInit() {
    this.subscription = this.service.currentMessage.subscribe(message => {
      console.log("subscribe");
      console.log(message);
      this.x = this.transform_series(message.min);
      this.y = this.transform_series(message.mean);
      this.z = this.transform_series(message.max);
      this.u = this.transform_series(message.median);
      this.v = this.transform_series(message.q9);

      let datasets = [
        { data: this.x, label: 'min', steppedLine: true },
        { data: this.y, label: 'mittel', steppedLine: true },
        { data: this.u, label: 'median', steppedLine: true },
        { data: this.v, label: '90% quantil', steppedLine: true },
        { data: this.z, label: 'max', steppedLine: true },
      ];

      this.lineChartData = datasets;

    })
  }

  lineChartColors: Color[] = [
    {
      borderColor: 'limegreen',
      backgroundColor: 'rgba(0,255,0,0.1)',
    },
    {
      borderColor: '#0066cc',
      backgroundColor: 'rgba(0,102,204,0.1)',
    },
    {
      borderColor: '#00ffff',
      backgroundColor: 'rgba(0,255,255,0.1)',
    },
    {
      borderColor: '#ff8800',
      backgroundColor: 'rgba(255,36,0,0.1)',
    },
    {
      borderColor: 'red',
      backgroundColor: 'rgba(255,0,0,0.1)',
    },

  ];


  lineChartData: ChartDataSets[] = []/*[
    { data: this.x, label: 'Crude oil prices', steppedLine: true },
  ];*/

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'minute',
            unitStepSize: 15,
            displayFormats: {
              minute: 'HH:mm'
            },
            min: new Date(1970, 0, 1, 8, 0, 0),
            max: new Date(1970, 0, 1, 21, 0, 0)
          }
        }
      ],
      yAxes: [{
        display: true,
        ticks: {
          suggestedMin: 1.10,    // minimum will be 0, unless there is a lower value.
          // OR //
          //beginAtZero: true   // minimum value will be 0.
          suggestedMax: 1.50,
        }
      }]
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

}