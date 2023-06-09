import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as atlas from 'azure-maps-control'
import { Shape } from 'azure-maps-control';
import { cities } from './data/Steden';
import { AzureMapService } from './services/azure-map.service';

class ResObject {
  formatVersion!: string
  reachableRange!: ReachableRange
}

class ReachableRange {
  center!: Coordinate
  boundary!: Coordinate[]
}

class Coordinate {
  latitude!: number
  longitude!: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'TravelDistanceMatrix';
  map!: atlas.Map
  popupTemplate = '<div>{Name}</div>';


  constructor(private mapsService: AzureMapService) {}

  getMatrix() {
    console.log('hello')
    this.mapsService.AsynchronousRouteMatrixRequest().subscribe(result => {
      console.log(result);
      this.formatResult(result);
    })
  }

  private formatResult(result: ResObject) {
    const output: number[][] = [];
    const polygon = [];
    result.reachableRange?.boundary?.forEach(coordinate => {
      output.push([coordinate.longitude, coordinate.latitude])
    });

    polygon.push(output);
    let dataSource = new atlas.source.DataSource();
    this.map.sources.add(dataSource);

    var collection = new atlas.data.FeatureCollection([new atlas.data.Feature(new atlas.data.Polygon(polygon))])
    console.log('collection', collection);

    dataSource.add(new atlas.data.Feature(
      new atlas.data.Polygon(polygon)
    ))

    this.map.layers.add(new atlas.layer.PolygonLayer(dataSource, '',{
      fillColor: 'red',
      fillOpacity: 0.7
    }))

    var citySource = new atlas.source.DataSource();
    this.map.sources.add(citySource);
    citySource.add(cities);

    var cityLayer = new atlas.layer.SymbolLayer(citySource);

    this.map.layers.add(cityLayer)

    let popup = new atlas.Popup({
      pixelOffset: [0, -18],
      closeButton: false
    });

    this.map.events.add('mouseover', cityLayer, (e) => {
      if(e.shapes && e.shapes.length > 0) {
        var content, coordinate;
        var properties = (<Shape>e.shapes[0]).getProperties();
        content = this.popupTemplate.replace(/{Name}/g, properties.Name);
        coordinate = (<Shape>e.shapes[0]).getCoordinates();

        popup.setOptions({
          //Update the content of the popup.
          content: content,

          //Update the popup's position with the symbol's coordinate.
          position: <atlas.data.Position>coordinate

        });
        //Open the popup.
        popup.open(this.map);
      }
    })

    console.log(this.map)
  }

  ngAfterViewInit(): void {
    var map = new atlas.Map('myMap', {
      center: [4.5270, 51.9142],
      zoom: 12,
      language: 'en-US',
      authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: 'WfxRG4wJR1zhpywJwv5KiaIPUTIwupcYO_j1j4x38ag'
      }
    });

    this.map = map
  }
}
