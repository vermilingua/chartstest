import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Test';
  public onMapReady(event) {
    console.log("Map Ready")
  }
  ngOnInit() {

  }
}