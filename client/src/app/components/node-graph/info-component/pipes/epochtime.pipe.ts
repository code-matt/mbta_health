import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
  name: 'EpochPipe',
})

@Injectable()
export class EpochPipe implements PipeTransform {
  transform(time,date:boolean) {
    var d = new Date(0);
    d.setUTCSeconds(time);
    if(date){
      return d.toLocaleString()
    }else{
      return d.toLocaleTimeString()
    }
  }
}