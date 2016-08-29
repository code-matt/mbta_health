import { Component, Output, EventEmitter, Input } from '@angular/core'
import { Control } from '@angular/common'
import { SearchResultsComponent } from './search-results.component'
import 'rxjs/add/operator/debounceTime'

@Component({
  selector: 'node-header',
  styleUrls: ['header-controls.component.css'],
  templateUrl: 'header-controls.component.html'
})

export class HeaderComponent {
  @Output() loadStation = new EventEmitter();
  @Input() nodes = {};
  search = new Control();
  query: string;

  constructor(){
    this.search.valueChanges
      .debounceTime(500)
      .subscribe(
        s => this.query = s,
        error => console.log(error))
  }

  load(event){
    this.loadStation.emit({
      node: event.node,
    })
  }

  focus: boolean
  gainFocus(){
    this.focus = true;
  }
  loseFocus(){
    this.focus = false;
  }

}