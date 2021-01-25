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
import { SeriesDataService } from '../services/series-data.service'
import {Fill, Stroke, Circle, Text} from 'ol/style';
import {Polygon, Circle as Radius} from 'ol/geom';
import {circular as circularPolygon} from 'ol/geom/Polygon';


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
  @Output() mapReady = new EventEmitter<Map>();

  constructor(private zone: NgZone, private cd: ChangeDetectorRef, private service: SeriesDataService) { }

  vectorSource;
  vectorLayer;

  ngAfterViewInit():void {
    if (! this.Map) {
      this.zone.runOutsideAngular(() => this.initMap())
    } 
    setTimeout(()=>this.mapReady.emit(this.Map));
  }

  private initMap(): void{

    let stations = this.service.get_stations();
    let ft = Math.floor(stations.length/3);
    let st = Math.floor((2*stations.length)/3);

    var radius = 10100;
    var x, y;
    //for (x = -180; x < 180; x += 30) {
      //for (y = -90; y < 90; y += 30) {
        var circle4326 = circularPolygon([11.007, 49.59], radius, 64);
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
/*
    let ra = new Feature(new Radius(fromLonLat([11.007, 49.59 ]), 15000));
    ra.setStyle(new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
     }));
    
    markers.push(ra);
*/

    for(var i = 0; i < stations.length; i++){
      let lon = parseFloat(stations[i][1]);
      let lat = parseFloat(stations[i][2]);
      let stat_name = stations[i][0].split(",")[0];
      let  x = new Feature({
        geometry: new Point(fromLonLat([lon, lat]))
      });

      let c;
      let r;
      if(i<ft){
        c = [0, 255, 0];
        r = 6;
      }else if(i<st){
        c = [255, 255, 0];
        r = 5;
      }else{
        c = [255, 8, 0];
        r = 4;
      }

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
       image: new Circle({
        radius: r,
        fill: new Fill({
          color: c
        }),
        stroke: new Stroke({
          color: 'black',
          width: 1
        }),
      })
      
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


    this.view = new View({
      center: fromLonLat([11.007, 49.59 ]),
      zoom: 11,

    });
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
    });
  }

}