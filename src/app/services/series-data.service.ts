import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';
import { FuelPriceData } from '../interfaces/fuelprice-data'

@Injectable({
   providedIn: 'root'
})
export class SeriesDataService {

   fd : FuelPriceData = {
      location: '',
      lat: "0",
      lon: "0",
      fuel_type: '',
      creation_date: '',
      horizon: '',
      mean: [],
      median: [],
      min: [],
      max: [],
      q9: [],
      liga: [],
      d_mean: [],
      d_median: [],
      d_min: [],
      d_max: [],
      d_q9: [],      
    }

   private messageSource = new BehaviorSubject(this.fd);
   currentMessage = this.messageSource.asObservable();

   constructor(private httpClient: HttpClient) { }

   changeMessage(message: string) {
      const p = this.get_data(message);
      p.then((data: any) => {
         this.messageSource.next(data); 
       }).catch((error) => {
         if (error.status === 401 || error.status === 403) {
           console.log("not authorized")
         } else {
         }
       });

   }

   get_data(dataset: string) {
      let url = "https://fuelprice-data.s3.eu-central-1.amazonaws.com/" + dataset + ".json"
      const promise = this.httpClient.get(url, {}).toPromise();
      return promise;
   }

}
