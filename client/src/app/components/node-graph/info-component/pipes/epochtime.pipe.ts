import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
  name: 'EpochPipe',
})

@Injectable()
export class EpochPipe implements PipeTransform {
  transform(time) {
    var d = new Date(0);
    d.setUTCSeconds(time);
    return d.toLocaleTimeString()
  }
}