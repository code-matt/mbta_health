import { Component, Input, OnInit, OnChanges } from '@angular/core'

@Component({
  selector: 'schedule-summary',
  template: `
    <div (click)="toggleActive()">{{route}}</div>
    <div *ngIf="active">
      im active!
    </div>
  `
})
export class ScheduleSummaryComponent{
  private active:boolean = false
  @Input() route


  toggleActive(){
    this.active = !this.active
  }
}