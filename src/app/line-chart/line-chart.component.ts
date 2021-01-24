import { Component } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SeriesDataService } from '../services/series-data.service'

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

/*
https://stackoverflow.com/questions/50982006/display-date-label-in-axes-chart-js-ng2-charts
*/


export class LineChartComponent {

  constructor(private service: SeriesDataService) {

  }

  private x = this.service.get_series("diesel", "min")
  private y = this.service.get_series("diesel", "mean")
  private z = this.service.get_series("diesel", "max")
  private u = this.service.get_series("diesel", "median")
  private v = this.service.get_series("diesel", "q9")


  datasets: Array<any> = [
    { data: this.x, label: 'min', steppedLine: true },
    { data: this.y, label: 'mittel', steppedLine: true },
    { data: this.z, label: 'max', steppedLine: true },
    { data: this.u, label: 'median', steppedLine: true },
    { data: this.v, label: 'q9', steppedLine: true },
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