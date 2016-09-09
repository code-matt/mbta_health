import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { AlertSummaryComponent } from './alert-summary.component'
import { ScheduleSummaryComponent } from './schedule-summary.component'
import { SchedulePipe } from '../pipes/schedule.pipe'

@Component({
  selector: 'info-pane',
  styleUrls: ['info-pane.component.css'],
  template: `
    <div class="route-details" [ngClass]="{'slideLeft':active, 'slideRight':!active}" style="overflow:auto;" (click)="toggleAlerts()">
      <h3>{{selected.stop_name}}</h3>
      <span *ngIf="stationAlerts.length > 0">
        <span class="glyphicon glyphicon-alert" aria-hidden="true"></span>This station has alerts!
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg">View</button>
      </span>
      <hr/>
      <div *ngFor="let stop of selected.stop_ids | SchedulePipe:schedules">
        <schedule-summary [stop]="stop" [ticksSinceUpdate]="ticksSinceUpdate"></schedule-summary>
      </div>
    </div>
    <div class="modal fade bs-example-modal-lg alerts" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <h2>Alerts for {{selected.stop_name}}</h2>
          <hr/>
          <div *ngFor="let alert of stationAlerts" class="alert">
            <p>Description: {{alert.alert.header_text}}</p>
            <p>Effect Name: {{alert.alert.effect_name}}</p>
            <p>Severity: {{alert.alert.severity}}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InfoPaneComponent {
  constructor(){}
  @Input() active
  @Input() selected
  @Input() schedules
  @Input() alerts
  @Input() ticksSinceUpdate
  public stationAlerts: any[] = []
  public alertsActive: boolean = false

  ngOnInit() {
  }

  toggleAlerts(){
    this.alertsActive = !this.alertsActive
  }

  ngOnChanges(changes) {
    if(changes.selected){
      if(changes.selected.currentValue == undefined ){
        this.selected = {
          stop_name: "None Selected"
        }
        this.stationAlerts = []
      }else{
        if(this.schedules && this.alerts.alerts){
          this.stationAlerts = this.alerts.alerts.filter(a => a.id == this.selected.mbta_id)
        }       
      }
    }
  }
}