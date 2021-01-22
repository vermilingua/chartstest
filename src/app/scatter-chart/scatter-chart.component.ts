// scatter-area-chart.component.ts
import { Component } from '@angular/core';
import { ChartOptions, ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-scatter-chart',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.css']
})
export class ScatterChartComponent {

  public scatterChartOptions: ChartOptions = {
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

  public scatterChartData: ChartDataSets[] = [
    {
      data: [
        { x: new Date('December 10, 1995 03:24:00'), y: 215 },
        { x: new Date('December 11, 1995 03:24:00'), y: 325 },
        { x: new Date('December 12, 1995 03:24:00'), y: 185 },
        { x: new Date('December 13, 1995 03:24:00'), y: 332 },
        { x: new Date('December 14, 1995 03:24:00'), y: 406 },
        { x: new Date('December 15, 1995 03:24:00'), y: 522 },
        { x: new Date('December 16, 1995 03:24:00'), y: 412 },
        { x: new Date('December 17, 1995 03:24:00'), y: 614 },
        { x: new Date('December 18, 1995 03:24:00'), y: 544 },
        { x: new Date('December 19, 1995 03:24:00'), y: 421 },
      ],
      label: 'Icecream sales vs Temperature',
      //pointRadius: 10,
      steppedLine: true
    },
  ];
  public scatterChartType: ChartType = 'scatter';
  public colors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

}