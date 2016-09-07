import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
  name: 'SchedulePipe',
})

@Injectable()
export class SchedulePipe implements PipeTransform {
  transform(route,selected,schedules) {
    
    var arr = []
    var routes = []
    var copy = JSON.parse(JSON.stringify(schedules));
    for(let line in route){
      routes.push(route[line].routeId)
    }
    for(let route in routes){
      arr.push(copy[routes[route]])
    }

    arr = arr.filter(function(n){ return n != undefined }); 

    for(let route in arr){
      for(let dir in arr[route]){
        arr[route][dir] = arr[route][dir].filter( s => s.stop_id == selected.mbta_id)
      }
    }
    debugger
    return arr
  }
}