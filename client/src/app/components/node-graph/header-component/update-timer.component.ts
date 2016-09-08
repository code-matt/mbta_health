import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { Observable } from 'rxjs'

@Component({
  selector: 'update-timer',
  template: `
    Time since last MBTA data: <span style="color: #6A5170; font-size: 2em">{{timeSinceUpdate}}</span><span style="color: #816F85">s</span>
  `
})
export class UpdateTimerComponent implements OnInit, OnChanges {
  public timeSinceUpdate: number = 0
  @Input() updateCount: number = 0

  ngOnInit(){
    let timer = Observable.timer(0,1000);
    timer.subscribe(t => this.timeSinceUpdate++);
  }

  ngOnChanges(changes){
    this.timeSinceUpdate = 0
  }
}