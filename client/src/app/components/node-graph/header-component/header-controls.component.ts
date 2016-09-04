import { Component, Output, EventEmitter, Input } from '@angular/core'
import { Control } from '@angular/common'
import { SearchResultsComponent } from './search-results.component'
import 'rxjs/add/operator/debounceTime'
import { ENV } from '../../../shared/env'
import { UpdateTimerComponent } from './update-timer.component'

@Component({
  selector: 'node-header',
  styleUrls: ['header-controls.component.css'],
  templateUrl: 'header-controls.component.html'
})

export class HeaderComponent {

  @Output() loadStation = new EventEmitter();
  @Input() nodes = {};
  @Input() updateCount: number = 0
  search = new Control();
  query: string;
  public env = ENV

  constructor() {
    this.search.valueChanges
      .debounceTime(50)
      .subscribe(
      s => this.query = s,
      error => console.log(error))
  }

  load(event) {
    this.loadStation.emit({
      node: event.node,
    })
  }

  focus: boolean
  gainFocus() {
    this.focus = true;
  }
  loseFocus() {
    this.focus = false;
  }

}