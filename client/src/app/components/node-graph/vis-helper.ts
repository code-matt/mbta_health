import * as vis from 'vis'
import { NodeGraphComponent } from './node-graph.component'

export class VisHelper {
  public network
  public parent: NodeGraphComponent

  node_dataset: vis.INode[] = []
  edge_dataset: vis.IEdge[] = []
  node_options: vis.INodeOptions = {
    shape: 'dot',
    size: 20,
    font: {
      color: '#FFFFFF',
      size: 20,
      strokeColor: '#FF0000'
    },
    fixed: true
  }

  private scalingOptions: vis.IOptionsScaling = {
    min: 1000,
    max: 1000,
  }

  edge_options: vis.IEdgeOptions = {
    font: {
      size: 10,
    },
    scaling: this.scalingOptions
  }

  buildOptions() {
    var groups = {}
    for (var node in this.parent.nodes.nodes) {
      groups[this.parent.nodes.nodes[node]["mbta_id"]] = {
        color: 'rgb(0,255,140)'
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
          alert => alert["id"] == this.parent.nodes.nodes[node]["mbta_id"])
        var color = filter.length > 0 ? 'red' : 'rgb(0,255,140)'

        groups[this.parent.nodes.nodes[node]["mbta_id"]] = {
          color: color
        }
      }
    }
    var options = {
      nodes: this.node_options,
      edges: this.edge_options,
      groups: groups
    }
    this.network.setOptions(options)
  }
}