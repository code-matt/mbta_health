import { Component, OnInit } from '@angular/core'
import { ThingService } from '../../services/thing.service'
import { HTTP_PROVIDERS } from '@angular/http'


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
  constructor(private _thingservice: ThingService){
  }
  ngOnInit(){
    this._thingservice.getThings()
      .subscribe(data => this.things = data,
                error => console.log(error))
  }
}
