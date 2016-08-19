import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { HTTP_PROVIDERS } from '@angular/http'
import { Observable } from 'rxjs'
import { User } from '../../shared/interfaces/user.interface'
import { Router } from '@angular/router';

@Component({
  selector: 'signup-form',
  templateUrl: './signup-form.component.html'
})

export class SignupFormComponent implements OnInit{
  public user: User
  public errors: any[] = []

  constructor(
    private _router: Router,
    private _authService: AuthService) {
  }

  ngOnInit(){
    this.user = {
      email: '',
      password: ''
    }
  }

  onSubmit(userCreds: User){
    var component = this
    this._authService.signup(this._authService.formatUser(userCreds))
    .then(
      res => {
        component._router.navigate(['index'])
      },
      err => {
        component.errors = err.errors
      })
  }
}
