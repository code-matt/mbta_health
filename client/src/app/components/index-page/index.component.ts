import { Component, OnInit } from '@angular/core'
import { ThingService } from '../../services/thing.service'
import { AuthService } from '../../services/auth.service'
import { HTTP_PROVIDERS } from '@angular/http'
import { Observable } from 'rxjs'

@Component({
  selector: `index-page`,
  providers: [ThingService,HTTP_PROVIDERS],
  template: `
    I am a IndexPageComponent, hi ^^
    <hr/>
    --
    Things:
    <ul>
      <li *ngFor="let thing of things">
        {{thing.name}} -- {{thing.value}}
      </li>
    </ul>
  `
})

export class IndexPageComponent implements OnInit {

  things: any;
  constructor(
    private _thingservice: ThingService,
    private _authService: AuthService){
    }


  ngOnInit(){
    var obs = this._authService.authenticate(this._authService.fakeCreds())
    .then(res => this.loadData())
  }

  loadData(){
    this._thingservice.getThings()
      .subscribe(
        data => this.things = data,
        error => console.log(error))
  }
}