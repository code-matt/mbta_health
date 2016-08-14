import {Injectable} from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ThingService {
  constructor(private _http: Http){}

  getThings() {
    return this._http.get("http://localhost:3000/api/v1/things")
      .map(res => res.json(),
          error => console.log(error))
  }
}
