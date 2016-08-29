import { Component } from '@angular/core'
import { Router } from '@angular/router'

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
  constructor(private _router:Router){

  }
  title = 'app works!';
}
