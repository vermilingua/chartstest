import { Component } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SeriesDataService } from '../services/series-data.service'
import { Subscription } from 'rxjs';
import { FuelPriceData } from '../interfaces/fuelprice-data'

@Component({
  selector: 'app-line-chart-daily',
  templateUrl: './line-chart-daily.component.html',
  styleUrls: ['./line-chart-daily.component.css']
})

/*
https://stackoverflow.com/questions/50982006/display-date-label-in-axes-chart-js-ng2-charts
*/


export class LineChartDailyComponent {

  constructor(private service: SeriesDataService) {

  }
  private city = "erlangen";
  private x = []; 

  message: FuelPriceData;
  subscription: Subscription;

  lineChartData: ChartDataSets[]; 

  transform_series(series) {
    let data = [];
    for (var i = 0; i < series.length; i++) {
      console.log(series[i][0]);
      data.push({ x: new Date(series[i][0]), y: series[i][1] });
    }
    return data;

  }

  private mean = [];
  private median = [];
  private min = [];
  private max = [];
  private q9 = [];

  ngOnInit() {

    this.subscription = this.service.currentMessage.subscribe(message => {

      this.min = this.transform_series(message.d_min);
      this.mean = this.transform_series(message.d_mean);
      this.max = this.transform_series(message.d_max);
      this.median = this.transform_series(message.d_median);
      this.q9 = this.transform_series(message.d_q9);

      let datasets = [
        { data: this.min, label: 'min', steppedLine: true },
        { data: this.mean, label: 'mittel', steppedLine: true },
        { data: this.median, label: 'median', steppedLine: true },
        { data: this.q9, label: '90% quantil', steppedLine: true },
        { data: this.max, label: 'max', steppedLine: true },
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

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'day',
            unitStepSize: 1,
            displayFormats: {
              minute: 'dd MM'
            }
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