import { Component, OnInit, ViewChild } from '@angular/core'
import { ThingService } from '../../services/thing.service'
import * as vis from 'vis'

@Component({
  selector: 'node-graph',
  template: `
  <div class="row">
    <div class="col-lg-12">
      <div #network class="mbta-network"></div>
    </div>
  </div>
  `,
  styleUrls: ['node-graph.component.css'] 
})
export class NodeGraphComponent2 implements OnInit {
  constructor(private _thingService: ThingService){

  }
  private nodes: any
  node1: vis.INode = {id: '1', label: 'Node 1', x:10, y: 0}
  node2: vis.INode = {id: '2', label: 'Node 2', x:20, y: -100}
  edge1: vis.IEdge = {from: '1', to: '2'}
  node_dataset: vis.INode[] = [
  ]
  node_options: vis.INodeOptions = {
    shape: 'dot',
    size: 20,
    font: {
      color: '#FFFFFF',
      size: 30,
      strokeColor: '#FF0000'
    }
  }
  
  options: vis.IOptions = { 
    nodes: this.node_options,
    physics: {
      layout:{
        improvedLayout: true,
        hierarchical: {
          enabled:true,
          levelSeparation: 300,
          nodeSpacing: 2000,
          treeSpacing: 1000,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          direction: 'UD',        // UD, DU, LR, RL
          sortMethod: 'hubsize'   // hubsize, directed
        }
      }
    }
  }
  edge_dataset: vis.IEdge[] = [
  ]
  stuff: vis.IData = {
    nodes: this.node_dataset,
    edges: this.edge_dataset
  };

  @ViewChild('network') network
  ngOnInit(){
    // console.log(network)
    this.loadData()
  }
  loadData(){
    this._thingService.getThings()
      .subscribe(
        data => {
          this.nodes = data;
          console.log(this.nodes);
          this.buildNetwork(this.nodes)
        },
        error => console.log(error))
  }
  buildNetwork(data){
    for (var node in data.nodes){
      node = data.nodes[node]
      var newNode: vis.INode = {id: node["node_id"], label: node["stop_name"]}
      this.node_dataset.push(newNode)
    }
    for (var edge in data.edges){
      edge = data.edges[edge]
      var newEdge: vis.IEdge = {from: edge["from"], to: edge["to"]}
      this.edge_dataset.push(newEdge)
    }
    var network_data: vis.IData = {
      nodes: this.node_dataset,
      edges: this.edge_dataset
    };
    var network = new vis.Network(this.network.nativeElement,network_data,this.options)
    network.redraw
  }
}