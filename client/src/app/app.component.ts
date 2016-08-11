import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router'

@Component({
  moduleId: module.id,
  directives: [ROUTER_DIRECTIVES],
  selector: 'app-root',
  template: `
    <h2>app works!</h2>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'app works!';
}
