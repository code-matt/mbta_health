import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { AlertSummaryComponent } from './alert-summary.component'

@Component({
  selector: 'info-pane',
  styleUrls: ['info-pane.component.css'],
  template: `
    <div class="route-details" [ngClass]="{'slideLeft':active, 'slideRight':!active}">
      <ul class="nav nav-pills">
        <li role="presentation" class="active">Schedule</li>
        <li role="presentation">Alerts</li>
      </ul>
      <br/>
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