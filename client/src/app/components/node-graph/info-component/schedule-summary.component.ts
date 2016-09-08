import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { EpochPipe } from './pipes/epochtime.pipe'
import { CountdownPipe } from './pipes/countdown.pipe'

@Component({
  selector: 'schedule-summary',
  template: `
    <div class="row" *ngIf="stop">
      <div class="col-md-10 col-md-offset-1 schedule-summary">
        <span class="title">{{stop.route}} - {{stop.direction}}</span>
        <br/>
        <p>Away: {{schedule.pre_away | CountdownPipe:ticksSinceUpdate}}</p>
        <p>Departure Time: {{schedule.pre_dt | EpochPipe}}</p>
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