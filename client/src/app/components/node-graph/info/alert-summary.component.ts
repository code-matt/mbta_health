import { Component,Input } from '@angular/core'

@Component({
  selector: 'alert-summary',
  template: `
    alert!
  `
})
export class AlertSummaryComponent {
  @Input() alert = alert
}