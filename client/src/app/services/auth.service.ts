import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http'
import {AuthHttp, AuthConfig, AUTH_PROVIDERS} from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private loggedIn = false;

  constructor(private _http: Http){
    this.loggedIn = !!localStorage.getItem('id_token');
  }

  authenticate(data) {
    var service:AuthService = this

    return new Promise(function(resolve, reject) {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

      service._http.post(
        "http://localhost:3000/api/v1/knock/auth_token",
        data,{
          headers: headers
        })
      .map(res => res.json())
      .subscribe(
        data => {
          if (data.jwt){
            resolve(data)
            service.saveJwt(data.jwt)
          }else{
            reject('auth failure')
          }
        },
        error => reject('auth failure'))
    });
  }
  
  formatCreds(data){
    return JSON.stringify({ 
      auth: {
        email: data.email,
        password: data.password
      }
    })
  }

  saveJwt(jwt) {
    if(jwt) {
      localStorage.setItem('id_token', jwt)
      this.loggedIn = true
    }
  }

  logout() {
    localStorage.removeItem('id_token');
    this.loggedIn = false;
  }

  isLoggedIn(){
    return this.loggedIn;
  }
}