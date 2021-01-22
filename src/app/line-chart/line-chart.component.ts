import { Component } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

/*
https://stackoverflow.com/questions/50982006/display-date-label-in-axes-chart-js-ng2-charts
*/


export class LineChartComponent {

  private x = [
    { x: new Date('December 10, 1995 03:24:00'), y: 215 },
    { x: new Date('December 11, 1995 03:24:00'), y: 325 },
    { x: new Date('December 12, 1995 14:24:00'), y: 185 },
    { x: new Date('December 13, 1995 03:24:00'), y: 332 },
    { x: new Date('December 14, 1995 03:24:00'), y: 406 },
    { x: new Date('December 15, 1995 03:24:00'), y: 522 },
    { x: new Date('December 16, 1995 03:24:00'), y: 412 },
    { x: new Date('December 17, 1995 03:24:00'), y: 614 },
    { x: new Date('December 18, 1995 03:24:00'), y: 544 },
    { x: new Date('December 19, 1995 03:24:00'), y: 421 },
  ]

  private y = [
    { x: new Date('December 10, 1995 04:24:00'), y: 215 },
    { x: new Date('December 11, 1995 04:24:00'), y: 325 },
    { x: new Date('December 12, 1995 15:24:00'), y: 185 },
    { x: new Date('December 13, 1995 04:24:00'), y: 332 },
    { x: new Date('December 14, 1995 06:24:00'), y: 406 },
    { x: new Date('December 15, 1995 12:24:00'), y: 522 },
    { x: new Date('December 16, 1995 06:24:00'), y: 412 },
    { x: new Date('December 17, 1995 06:24:00'), y: 614 },
    { x: new Date('December 18, 1995 06:24:00'), y: 544 },
    { x: new Date('December 19, 1995 06:24:00'), y: 421 },
  ]

  datasets: Array<any> = [
    { data: this.x, label: 'Price 24h', steppedLine: true },
    { data: this.y, label: 'Open', steppedLine: true }
  ];

  lineChartData: ChartDataSets[] = this.datasets;/*[
    { data: this.x, label: 'Crude oil prices', steppedLine: true },
  ];*/

  lineChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM D', // This is the default
            }
          }
        }
      ]
    }
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

}