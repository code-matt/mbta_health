import * as vis from 'vis'
import { NodeGraphComponent } from './node-graph.component'
import { Observable } from 'rxjs'

export class VisHelper {
  public network
  public parent: NodeGraphComponent

  node_dataset: vis.INode[] = []
  edge_dataset: vis.IEdge[] = []
  node_options: vis.INodeOptions = {
    shape: 'dot',
    size: 30,
    font: {
      color: '#000000',
      size: 40,
    },
    fixed: true
  }

  edge_options: vis.IEdgeOptions = {
    font: {
      size: 10,
    },
    width: 10
  }

  buildOptions() {
    var groups = {}
    for (var node in this.parent.nodes.nodes) {
      groups[this.parent.nodes.nodes[node]["stop_name"]] = {
        color: 'rgb(106,81,112)'
      }
    }
    var options:vis.IOptions = {
      nodes: this.node_options,
      edges: this.edge_options,
      groups: groups,
      physics: {
        enabled: false
      }
    }
    return options
  }

  rebuildOptions() {
    var groups = {}
    for (var node in this.parent.nodes.nodes) {
      for (var alert in this.parent.alerts) {
        var filter = this.parent.alerts.alerts.filter(
          alert => alert["id"] == this.parent.nodes.nodes[node]["mbta_id"] || 
                    alert["id"] == this.parent.nodes.nodes[node]["stop_name"])
        var color = filter.length > 0 ? 'red' : 'rgb(0,255,140)'

        groups[this.parent.nodes.nodes[node]["stop_name"]] = {
          color: color
        }
      }
    }
    var options = {
      nodes: this.node_options,
      edges: this.edge_options,
      groups: groups
    }
    if(this.network){
      this.network.setOptions(options)
    }else{
      let timer = Observable.timer(500);
      timer.subscribe(t => {
        this.network = this.parent.network
        this.rebuildOptions()
      });
    }
  }
}