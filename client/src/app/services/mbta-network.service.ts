import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http'
import {AuthHttp, AuthConfig, AUTH_PROVIDERS} from 'angular2-jwt';
import { ENV } from '../shared/env'

@Injectable()
export class NetworkGraphService {
  public env = ENV
  constructor(private _http: Http){}

  getThings() {
    var headers = new Headers()
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('id_token'))
    
    return this._http.get(this.env.baseUrl + "/api/v1/graphs", {
      headers: headers
    })
    .map(
      res => res.json(),
      error => console.log(error))
  }
}
