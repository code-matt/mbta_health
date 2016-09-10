import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core'
import { AlertSummaryComponent } from './alert-summary.component'
import { ScheduleSummaryComponent } from './schedule-summary.component'
import { SchedulePipe } from '../pipes/schedule.pipe'
import { EpochPipe } from './pipes/epochtime.pipe'

@Component({
  selector: 'info-pane',
  styleUrls: ['info-pane.component.css'],
  template: `
    <div class="route-details" [ngClass]="{'slideLeft':active, 'slideRight':!active}" style="overflow:auto;" (click)="toggleAlerts()" (window:resize)="onResize($event)" [style.width.%]="width">
      <div class="col-xs-10">
        <h3>{{selected.stop_name}}</h3>
      </div>
      <div class="col-xs-2">
        <span class="glyphicon glyphicon-remove pull-right" aria-hidden="true" (click)="toggleDetails($event)"></span>
      </div>
      <div class="col-xs-12">
        <span *ngIf="stationAlerts.length > 0">
          <span class="glyphicon glyphicon-alert" aria-hidden="true"></span>This station has alerts!
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg">View</button>
        </span>
        <hr/>
      </div>
      <div *ngFor="let stop of selected.stop_ids | SchedulePipe:schedules" class="col-xs-6 col-sm-12">
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
            <p *ngIf="alert.alert.effect_name">Effect Name: {{alert.alert.effect_name}}</p>
            <p>Severity: {{alert.alert.severity}}</p>
            <p>Effect Start: {{alert.alert.effect_periods.effect_start | EpochPipe:true}}</p>
            <p *ngIf="alert.alert.effect_periods.effect_end">Effect End: {{alert.alert.effect_periods.effect_end | EpochPipe:true}}</p>
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
  @Output() closeDetails = new EventEmitter()
  public stationAlerts: any[] = []
  public alertsActive: boolean = false
  private width:number = 25

  ngOnInit() {
    var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    if(width < 768)
    {
      this.width = 90
    }

  }

  onResize(){
    var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    if(width < 768)
    {
      this.width = 90
    }else{
      this.width = 28
    }

  }

  toggleAlerts(){
    this.alertsActive = !this.alertsActive
  }

  toggleDetails(event){
    this.closeDetails.emit({close: true})
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