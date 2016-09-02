import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
  name: 'AlertsPipe',
})

@Injectable()
export class AlertsPipe implements PipeTransform {
  transform(alerts,selectedNode){
    return alerts.alerts.filter(alert => alert["id"] == selectedNode? true: false)
    // for(var alert in alerts){

    // }
    // return []

    // if (query == "" || query == undefined)
    //   return []
    // var re = new RegExp(query,'i')
    // return nodes.filter(
    //   node => {
    //     return re.test(node.stop_name)
    //   }).slice(0,9)
  }
}