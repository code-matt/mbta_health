import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
  name: 'SchedulePipe',
})

@Injectable()
export class SchedulePipe implements PipeTransform {
  transform(stops, schedules) {
    var arr = []
    var copy = JSON.parse(JSON.stringify(schedules));
    var arr = []
    for (let stop in stops) {
      var i = 0
      for (let direction in copy[stops[stop].route_id]) {
        arr.push({
          schedule: copy[stops[stop].route_id][direction].filter(sch => sch.stop_id == stops[stop].id),
          route: stops[stop].route_id,
          direction: Object.keys(copy[stops[stop].route_id])[i]
        })
        i++
      }
    }
    arr = arr.filter(obj => obj.schedule.length > 0)
    return this.uniq(arr,"direction","route")

  }
  uniq(a, param, param2) {
    return a.filter(function (item, pos, array) {
      return array.map(function (mapItem) { return mapItem[param]; }).indexOf(item[param]) === pos ||
        array.map(function (mapItem) { return mapItem[param2]; }).indexOf(item[param2]) === pos
    })
  }
}