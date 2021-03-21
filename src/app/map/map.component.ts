import {Component, NgZone, AfterViewInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {View, Feature, Map } from 'ol';
import {Coordinate} from 'ol/coordinate';
import { ScaleLine, defaults as DefaultControls} from 'ol/control';
import proj4 from 'proj4';
import VectorLayer from 'ol/layer/Vector';
import Projection from 'ol/proj/Projection';
import {register}  from 'ol/proj/proj4';
import {get as GetProjection} from 'ol/proj'
import {Extent} from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import OSM, {ATTRIBUTION} from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import {Icon, Style} from 'ol/style';
import { fromLonLat } from 'ol/proj.js';
import {Fill, Stroke, Circle, Text, RegularShape} from 'ol/style';
import {Polygon, Circle as Radius} from 'ol/geom';
import {circular as circularPolygon} from 'ol/geom/Polygon';
import { SeriesDataService } from '../services/series-data.service'
import { Subscription } from 'rxjs';
import { FuelPriceData } from '../interfaces/fuelprice-data'


@Component({
  selector: 'app-ol-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  view: View;
  projection: Projection;
  extent: Extent = [-20026376.39, -20048966.10, 20026376.39, 20048966.10];
  Map: Map;

  message: FuelPriceData;
  subscription: Subscription;
  
  @Output() mapReady = new EventEmitter<Map>();

  constructor(private zone: NgZone, private cd: ChangeDetectorRef, private service: SeriesDataService) { }

  vectorSource;
  vectorLayer;
  stations: any[];
  lon: number;
  lat: number;

  /*
  get_color(x){
    let y = [ 
      "#781c81",
      "#413b93",
      "#4065b1",
      "#488bc2",
      "#55a1b1",
      "#63ad99",
      "#7fb972",
      "#b5bd4c",
      "#d9ad3c",
      "#e68e34", 
      "#e6642c", 
      "#d92120"
    ]
    return y[x]
  }
  */
 
  getShape(min_price, price){
    let delta = (price - min_price) * 100;
    delta = Math.round(delta);
    
    let color = "#000000";
    let stroke = "#000000";
    let corners = 3;
    let r = 10;
    let r2 = r;

    if (delta < 5){
      corners = 5 
      r2 = 4;
    }else if (delta < 10){
      corners = 3
      r = 7;
      r2 = r;
    }else{
      corners = 4  
      r = 5;
      r2 = r;
    }

    if (delta == 0){
      color = "#00F700";
      stroke = "#00F700";
    }else if (delta == 1){
      color = "#00F700";
      stroke = "#F5ff00";
    }else if (delta == 2){
      color = "#00F700";
      stroke = "#FF8300";
    }else if (delta == 3){
      color = "#00F700";
      stroke = "#FE4164";
    }else if (delta == 4){
      color = "#00F700";
      stroke = "#000000";

    }else if (delta == 5){
      color = "#F5ff00";
      stroke = "#00F700";
    }else if (delta == 6){
      color = "#F5ff00";
      stroke = "#F5ff00";
    }else if (delta == 7){
      color = "#F5ff00";
      stroke = "#FF8300";
    }else if (delta == 8){
      color = "#F5ff00";
      stroke = "#FE4164";
    }else if (delta == 9){
      color = "#F5ff00";
      stroke = "#000000";
    
    }else if (delta <15){
      color = "#F5ff00";
      stroke = "#000000";

    }
    else{
      color = "#000000";
      stroke = "#000000";
      r = 5;
      r2 = r;
    }


    let shape = new RegularShape({
      fill: new Fill({
        color: color
      }),
      stroke: new Stroke({
        color: stroke,
        width: 2
      }),
      radius: r,
      radius2: r2,
      points: corners,
      angle: 0,
      //scale: [1, 0.5],
    })
    
    return shape;
  }

  ngOnInit(){

    this.view = new View({
      center: fromLonLat([11.007, 49.59 ]),
      zoom: 11,

    });

    this.Map = new Map({
      layers: [
        new TileLayer({
        source: new OSM({})
        })
      ],
      target: 'map',
      view: this.view,
      controls: DefaultControls().extend([
        new ScaleLine({}),
      ]),
    });
    this.subscription = this.service.currentMessage.subscribe(message => {
      this.stations = message.liga; 
      this.lon = parseFloat(message.lon);
      this.lat = parseFloat(message.lat);
      this.view.setCenter(fromLonLat([this.lon, this.lat]))

      this.build_map()
    })

  };

  ngAfterViewInit():void {

  }


  percentColors = [
      { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0x00 } },
      { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
      { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } },
      //{ pct: 1.0, color: { r:0x00, g: 0x00, b: 0xff } }, 
  ];

  /*getColorForPercentage = function(pct) {
      for (var i = 1; i < this.percentColors.length - 1; i++) {
          if (pct < this.percentColors[i].pct) {
              break;
          }
      }
      var lower = this.percentColors[i - 1];
      var upper = this.percentColors[i];
      var range = upper.pct - lower.pct;
      var rangePct = (pct - lower.pct) / range;
      var pctLower = 1 - rangePct;
      var pctUpper = rangePct;
      var color = {
          r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
          g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
          b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
      };
      return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
      // or output as hex if preferred
  }*/

  
  build_map(){

    if(this.stations.length == 0){
      return;
    }
    
    let ft = Math.floor(this.stations.length/3);
    let st = Math.floor((2*this.stations.length)/3);

    var radius = 10100;
    var x, y;
    //for (x = -180; x < 180; x += 30) {
      //for (y = -90; y < 90; y += 30) {
        var circle4326 = circularPolygon([this.lon, this.lat], radius, 64);
        var circle3857 = circle4326.clone().transform('EPSG:4326', 'EPSG:3857');
        //vectorLayer4326.getSource().addFeature(new Feature(circle4326));
        //this.vectorLayer.getSource().addFeature(new Feature(circle3857));
     // }
    //}

    var nf = new Feature(circle3857)
    nf.setStyle(new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 2
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
     }));


    let markers = [nf];
    
    let max_price = this.stations[this.stations.length-1][3]
    let min_price = this.stations[0][3]

    //const set = new Set<any>()
    //for(var i = 0; i < this.stations.length; i++){
    //  let price = parseFloat(this.stations[i][3]);
    //  set.add(price);
    //}
    //var prices = Array.from(set);
    //console.log(prices);

    for(var i = 0; i < this.stations.length; i++){
      let lon = parseFloat(this.stations[i][1]);
      let lat = parseFloat(this.stations[i][2]);
      let stat_name = this.stations[i][0].split(",")[0];
      let price = parseFloat(this.stations[i][3]);

      let  x = new Feature({
        geometry: new Point(fromLonLat([lon, lat]))
      });

      /*
      let p = Math.round(
        (price - min_price)
          /
          (max_price-min_price)
        );

      let p = (prices.indexOf(price)+1)/(prices.length)

      let c =  this.getColorForPercentage(1-p);
      let delta = (price - min_price) * 100;
      delta = Math.round(delta);
      console.log(delta);
      let c_index = Math.min(delta, 11);
      let c = this.get_color(c_index);
      let r = 5;
      */
      x.setStyle(new Style({

       text: new Text({
        font: '12px sans-serif',
        text: stat_name,
        offsetX: 15,
        offsetY: 10,
        fill: new Fill({
            color: 'black'
        }),
       }),
/*       image: new Circle({
        radius: r,
        fill: new Fill({
          color: c
        }),
        stroke: new Stroke({
          color: 'white',
          width: 2
        }),
      })

    image: new RegularShape({
      fill: new Fill({
        color: c
      }),
      stroke: new Stroke({
        color: 'green',
        width: 2
      }),
      radius: 10 / Math.SQRT2,
      radius2: 4,
      points: 3,
      angle: 0,
      //scale: [1, 0.5],
    }),
*/
    image: this.getShape(min_price, price)
      }));

      markers.push(x);

    }
    
    this.vectorSource = new VectorSource({
      features: markers
    });
  
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      //declutter: true,
    });



    /*
    this.Map = new Map({
      layers: [
        new TileLayer({
        source: new OSM({})
        }),
        this.vectorLayer
      ],
      target: 'map',
      view: this.view,
      controls: DefaultControls().extend([
        new ScaleLine({}),
      ]),
    });*/
    this.Map.addLayer(this.vectorLayer);
  }

}