import { Component,Input, OnChanges } from '@angular/core'

@Component({
  selector: 'alert-summary',
  template: `
    {{alert.alert.header_text}}
  `
})
export class AlertSummaryComponent implements OnChanges {
  @Input() alert = alert

  ngOnChanges(changes){
  }
}