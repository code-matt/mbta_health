import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
  name: 'SchedulePipe',
})

@Injectable()
export class SchedulePipe implements PipeTransform {
  transform(stops,schedules) {
    var arr = []
    var copy = JSON.parse(JSON.stringify(schedules));
    var arr = []
    for(let stop in stops){
      var i = 0
      for(let direction in copy[stops[stop].route_id]){
        arr.push({
          schedule: copy[stops[stop].route_id][direction].filter(sch => sch.stop_id == stops[stop].id ),
          route: stops[stop].route_id,
          direction: Object.keys(copy[stops[stop].route_id])[i]
        })
        i++
      }
    }
    var new_arr = []
    arr = arr.filter(obj => { 
      new_arr.push(obj)
      if(new_arr.filter( o => o.route == obj.route && o.direction == obj.direction).length == 1 &&
      obj.schedule.length > 0){
        return true
      }else{
        return false
      }
    })
    return arr
  }
}