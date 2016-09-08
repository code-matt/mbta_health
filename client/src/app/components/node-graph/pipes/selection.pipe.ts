import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
  name: 'SelectionPipe',
})

@Injectable()
export class SelectionPipe implements PipeTransform {
  transform(selectedNode, nodes) {
    if (nodes.nodes != undefined){
      return nodes.nodes.filter(node=> node == selectedNode)[0]
    }else{
      return undefined
    }
  }
}