import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core'
import { SearchPipe } from './search-results.pipe'

@Component({
  selector: 'search-results',
  styleUrls: ['header-controls.component.css'],
  template: `
    <div class="search-results">
      <div *ngFor="let node of nodes | SearchPipe:query">
        <div (click)="load(node)" class="search-result">{{node.stop_name}}</div>
      </div>
    </div>
  `
})

export class SearchResultsComponent implements OnChanges {
  @Input() nodes;
  @Input() query;
  @Output() loadStation = new EventEmitter();

  ngOnChanges(change: any){
    console.log(change)
  }

  load(node: any){
    this.loadStation.emit({
      node: node,
    })
  }
}