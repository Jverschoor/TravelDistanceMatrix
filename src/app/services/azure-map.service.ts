import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AzureMapService {

  constructor(private http: HttpClient) { }

  // todo: name change
  AsynchronousRouteMatrixRequest() : Observable<any> {
    var url = 'https://atlas.microsoft.com/route/range/json?api-version=1.0&query=51.91420,4.5270&timeBudgetInSec=21600&subscription-key=WfxRG4wJR1zhpywJwv5KiaIPUTIwupcYO_j1j4x38ag'
    return this.http.get(url);
  }
}
