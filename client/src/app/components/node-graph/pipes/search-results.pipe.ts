import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
  name: 'SearchPipe',
})

@Injectable()
export class SearchPipe implements PipeTransform {
  transform(nodes, query) {
    if (query == "" || query == undefined)
      return []
    var re = new RegExp(query, 'i')
    return nodes.filter(
      node => {
        return re.test(node.stop_name)
      }).slice(0, 9)
  }
}