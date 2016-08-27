import { Component, OnInit } from '@angular/core'
import { ThingService } from '../../services/thing.service'
import { AuthService } from '../../services/auth.service'
import { HTTP_PROVIDERS } from '@angular/http'
import { Observable } from 'rxjs'
import { NodeGraphComponent2 } from '../node-graph/node-graph.component'
import { HeaderComponent } from '../node-graph/header-controls.component.ts'

@Component({
  selector: `index-page`,
  providers: [ThingService,HTTP_PROVIDERS],
  directives: [NodeGraphComponent2, HeaderComponent],
  template: `
    <div class="container">
      <node-header></node-header>
      <node-graph></node-graph>
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
    // this.loadData()
  }

  loadData(){
    this._thingservice.getThings()
      .subscribe(
        data => this.things = data,
        error => console.log(error))
  }
}
