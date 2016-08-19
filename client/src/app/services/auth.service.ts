import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http'
import { Router } from '@angular/router'
import {AuthHttp, AuthConfig, AUTH_PROVIDERS} from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private loggedIn = false;

  constructor(private _http: Http, private _router: Router){
    this.loggedIn = !!localStorage.getItem('id_token');
  }

  authenticate(userCreds) {
    var service:AuthService = this

    return new Promise(function(resolve, reject) {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

      service._http.post(
        "http://localhost:3000/api/v1/knock/auth_token",
        userCreds,{
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
  };

  signup(userCreds){
    var service:AuthService = this

    return new Promise(function(resolve, reject) {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

      service._http.post(
        "http://localhost:3000/api/v1/users",
        userCreds,{
          headers: headers
        })
        .map(res => res.json())
        .subscribe(
          data => {
            if(!data.errors){
              resolve(data)
            }else{
              reject(data)
            }
          },
          error => reject('server error'))
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

  formatUser(data){
    return JSON.stringify({ 
      user: {
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

  logOut() {
    localStorage.removeItem('id_token');
    this.loggedIn = false;
    this._router.navigate(['login'])
  }

  isLoggedIn(){
    return this.loggedIn;
  }
}