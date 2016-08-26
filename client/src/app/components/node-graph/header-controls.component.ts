import { Component } from '@angular/core'

@Component({
  selector: 'node-header',
  styleUrls: ['header-controls.component.css'],
  template: `
    <div class="row">
      <div class="col-md-12">
        <div class="node-header">
          <img class="logo" src="http://localhost:3000/images/logo.png">
        </div>
      </div>
    </div>
  `
})
export class HeaderComponent {

}