import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { AlertSummaryComponent } from './alert-summary.component'

@Component({
  selector: 'info-pane',
  styleUrls: ['info-pane.component.css'],
  template: `
    <div class="route-details" [ngClass]="{'slideLeft':active}" [hidden]="!active">
      <div *ngFor="let alert of alerts">
        {{alert.alert.short_header_text}}
      </div>
    </div>
  `
})
export class InfoPaneComponent implements OnInit, OnChanges {
  @Input() active
  @Input() alerts

  ngOnInit() {
  }

  ngOnChanges(changes) {
  }
}