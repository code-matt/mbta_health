import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { AlertSummaryComponent } from './alert-summary.component'
import { ScheduleSummaryComponent } from './schedule-summary.component'
import { SchedulePipe } from '../pipes/schedule.pipe'

@Component({
  selector: 'info-pane',
  styleUrls: ['info-pane.component.css'],
  template: `
    <div class="route-details" [ngClass]="{'slideLeft':active, 'slideRight':!active}">
      <h3>{{selected.stop_name}}</h3>
      <br/>
      <div *ngFor="let alert of alerts">
        <alert-summary [alert]="alert"></alert-summary>
      </div>
      <div *ngIf="alerts.length == 0">
        No alerts for this station!
      </div>
      <div *ngFor="let route of routes | SchedulePipe:selected:schedules">
        <schedule-summary
        [route]="route"></schedule-summary>
      </div>
    </div>
  `
})
export class InfoPaneComponent {
  @Input() active
  @Input() routes
  @Input() selected
  @Input() schedules
  @Input() alerts

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if(changes.selected){
      if(changes.selected.currentValue == undefined ){
        this.selected = {
          stop_name: "None Selected"
        }
      }
    }
  }
}