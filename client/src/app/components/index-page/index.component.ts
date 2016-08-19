import { Component, OnInit } from '@angular/core'
import { ThingService } from '../../services/thing.service'
import { AuthService } from '../../services/auth.service'
import { HTTP_PROVIDERS } from '@angular/http'
import { Observable } from 'rxjs'

@Component({
  selector: `index-page`,
  providers: [ThingService,HTTP_PROVIDERS],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-lg-4">
          <hr/>
          --
          Things:
          <ul>
            <li *ngFor="let thing of things">
              {{thing.name}} -- {{thing.value}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})

export class IndexPageComponent implements OnInit {

  things: any;
  constructor(
    private _thingservice: ThingService,
    private _authService: AuthService){
  }


  ngOnInit(){
    this.loadData()
  }

  loadData(){
    this._thingservice.getThings()
      .subscribe(
        data => this.things = data,
        error => console.log(error))
  }
}