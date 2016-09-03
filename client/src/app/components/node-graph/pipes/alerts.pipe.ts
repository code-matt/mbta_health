import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
  name: 'AlertsPipe',
})

@Injectable()
export class AlertsPipe implements PipeTransform {
  transform(alerts, selectedNode) {
    return alerts.alerts.filter(alert => alert["id"] == selectedNode ? true : false)
  }
}