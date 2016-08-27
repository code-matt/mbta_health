import { Component } from '@angular/core'

@Component({
  selector: 'node-header',
  styleUrls: ['header-controls.component.css'],
  template: `
    <div class="row">
      <div class="col-md-12">
        <div class="node-header">
          <div class="row-fluid">
            <div class="col-md-3">
              <img class="logo" src="http://localhost:3000/images/logo.png">
            </div>
            <div class="col-md-2">
              <div class="dropdown">
                <div id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  Menu
                  <span class="caret"></span>
                </div>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a href="#">Open Settings</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="#">GitHub</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HeaderComponent {

}