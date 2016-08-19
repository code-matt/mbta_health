import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from './services/auth.service'

@Component({
  selector: 'app-root',
  template: `
    <h2>{{title}}</h2>
    <button
      type="button"
      (click)="_authService.logOut()"
      *ngIf="_authService.isLoggedIn()">
        LogOut
    </button>
    <button
      type="button"
      (click)="_router.navigate(['signup'])"
      *ngIf="!_authService.isLoggedIn()">
        SignUp
    </button>
    <button
      type="button"
      (click)="_router.navigate(['login'])"
      *ngIf="!_authService.isLoggedIn()">
        SignIn
    </button>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app.component.css']
})
export class AppComponent {
  constructor(private _router:Router,private _authService:AuthService){

  }
  title = 'app works!';
}
