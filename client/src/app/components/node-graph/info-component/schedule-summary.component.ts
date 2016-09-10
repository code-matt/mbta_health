import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { EpochPipe } from './pipes/epochtime.pipe'
import { CountdownPipe } from './pipes/countdown.pipe'

@Component({
  selector: 'schedule-summary',
  template: `
    <div class="row" *ngIf="stop">
      <div class="col-md-12 schedule-summary">
        <div>
          <table>
            <tr>
              <td>
                <span class="fa-stack fa-2x">
                  <i class="fa fa-square-o fa-stack-2x"></i>
                  <i [style.color]="schedule.color" class="fa fa-{{schedule.mode}} fa-stack-1x fa-inverse"></i>
                </span>
              </td>
              <td>
                <span>
                  {{stop.route}} - {{stop.direction}}
                </span>
              </td>
            </tr>
          </table>
        </div>
        <table class="sch">
          <tr class="sch-row">
            <td>
              <span class="fa-stack">
                <i class="fa fa-square-o fa-stack-2x"></i>
                <i [style.color]="schedule.color" class="fa fa-map-marker fa-stack-1x"></i>
              </span>
            </td>
            <td align="center">
              <tr class="sch-row-header">Destination</tr>
              <tr>{{schedule.trip_headsign}}</tr>
            </td>
          </tr>
          <tr class="sch-row">
            <td>
              <span class="fa-stack">
                <i class="fa fa-square-o fa-stack-2x"></i>
                <i [style.color]="schedule.color" class="fa fa-clock-o fa-stack-1x"></i>
              </span>
            </td>
            <td align="center">
              <tr class="sch-row-header">Predicted Arrival</tr>
              <tr>{{schedule.pre_away | CountdownPipe:ticksSinceUpdate}}</tr>
            </td>
          </tr>
          <tr class="sch-row">
            <td>
              <span class="fa-stack">
                <i class="fa fa-square-o fa-stack-2x"></i>
                <i [style.color]="schedule.color" class="fa fa-clock-o fa-stack-1x"></i>
              </span>
            </td>
            <td align="center">
              <tr class="sch-row-header">Departure Time</tr>
              <tr>{{schedule.pre_dt | EpochPipe:false}}</tr>
            </td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['info-pane.component.css']
})
export class ScheduleSummaryComponent implements OnChanges{
  private active:boolean = false
  @Input() stop
  @Input() ticksSinceUpdate
  private schedule

  toggleActive(){
    this.active = !this.active
  }

  ngOnChanges(changes){
    if(changes.stop && changes.stop.currentValue != undefined){
      this.schedule = this.stop.schedule[0]
    }
  }
}