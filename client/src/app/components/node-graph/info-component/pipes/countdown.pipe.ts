import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
  name: 'CountdownPipe',
})

@Injectable()
export class CountdownPipe implements PipeTransform {
  transform(time, tick) {
    var date = new Date(null);
    date.setSeconds(time - tick);
    return date.toISOString().substr(11, 8);
  }
}