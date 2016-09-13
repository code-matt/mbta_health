import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { Observable } from 'rxjs'

@Component({
  selector: 'update-timer',
  template: `
    <div class="data-status" (mouseenter)="hover = true" (mouseleave)="hover = false">
      <div class="status">
        <div *ngIf="status == undefined">
          {{title}}Soon..
        </div>
        <div *ngIf="status == 0">
          {{title}}<span style="color: #FF0000" class="glyphicon glyphicon-alert" aria-hidden="true"></span>MBTA Error!!
        </div>
        <div *ngIf="status == 1">
          {{title}}<span style="color: #00FF00"class="glyphicon glyphicon-ok" aria-hidden="true"></span><span style="color: #6A5170; font-size: 2em">{{timeSinceUpdate}}</span><span style="color: #816F85">s</span>
        </div>
        <div class="status-info">
          what does this mean?
        </div>
        <div class="explination" [ngClass]="{'pullDown':hover, 'pullUp':!hover}">
          <p>This website uses live data from the mbta every 30 seconds.
            Sometimes the MBTA API is down for a few minutes at a time.
            This means data will be stale until it comes back online.</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['header-controls.component.css']
})
export class UpdateTimerComponent implements OnInit, OnChanges {
  public timeSinceUpdate: number = 0
  @Input() updateCount: number = 0
  @Input() status
  public title = "MBTA data status: "
  public hover = false

  ngOnInit(){
    let timer = Observable.timer(0,1000);
    timer.subscribe(t => this.timeSinceUpdate++);
  }

  ngOnChanges(changes){
    this.timeSinceUpdate = 0
  }
}