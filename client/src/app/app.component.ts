import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from './services/auth.service'

@Component({
  selector: 'app-root',
  template: `
  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
  styleUrls: ['app.component.css']
})
export class AppComponent {
  constructor(private _router:Router,private _authService:AuthService){

  }
  title = 'app works!';
}
