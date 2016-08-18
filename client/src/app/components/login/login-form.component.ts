import {Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { HTTP_PROVIDERS } from '@angular/http'
import { Observable } from 'rxjs'
import { User } from '../../shared/interfaces/user.interface'
import { Router } from '@angular/router';

@Component({
  selector: 'login-form',
  templateUrl: 'app/components/login/login-form.component.html'
})

export class LoginFormComponent implements OnInit{
  public user: User
  
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
    this._authService.authenticate(this._authService.formatCreds(userCreds))
    .then(response => this._router.navigate(['index']))
  }
}