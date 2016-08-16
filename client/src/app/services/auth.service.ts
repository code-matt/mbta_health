import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http'
import {AuthHttp, AuthConfig, AUTH_PROVIDERS} from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  constructor(private _http: Http){}

  fakeCreds(){
    return {
      email: "foo@bar.com",
      password: "secret"
    }
  }

  authenticate(data) {

    var creds = JSON.stringify({ 
      auth: {
        email: data.email,
        password: data.password
      }
    })

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this._http.post(
      "http://localhost:3000/api/v1/knock/auth_token",
      creds,{
        headers: headers
      })
      .map(res => {
        var data = res.json()
        this.saveJwt(data.jwt)})
      .toPromise();

  }

  saveJwt(jwt) {
    if(jwt) {
      localStorage.setItem('id_token', jwt)
    }
  }
}