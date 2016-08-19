import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http'
import {AuthHttp, AuthConfig, AUTH_PROVIDERS} from 'angular2-jwt';

@Injectable()
export class ThingService {
  constructor(private _http: Http){}

  getThings() {
    var headers = new Headers()
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('id_token'))
    
    return this._http.get("http://localhost:3000/api/v1/things", {
      headers: headers
    })
    .map(
      res => res.json(),
      error => console.log(error))
  }
}
