import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  center: google.maps.LatLngLiteral = {lat: 37, lng: -122};
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];

  constructor(private http: HttpClient) { 
    this.http.get<any[]>('/asset/asset2').subscribe(locations => {
      this.markerPositions = []
      locations.forEach(location => this.markerPositions.push({lat:location.lat, lng:location.long})) 
      this.center = {lat:locations[locations.length-1].lat, lng:locations[locations.length-1].long}
    })
  }


}
