import { Component, OnInit, ViewChild } from '@angular/core'
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

  node1: vis.INode = {id: '1', label: 'Node 1', x:10, y: 0}
  node2: vis.INode = {id: '2', label: 'Node 2', x:20, y: -100}
  edge1: vis.IEdge = {from: '1', to: '2'}
  node_dataset: vis.INode[] = [
    this.node1,
    this.node2
  ]
  node_options: vis.INodeOptions = {
    shape: 'dot',
    size: 20,
    font: {
      color: '#FFFFFF',
      size: 30,
      strokeColor: '#FF0000'
    },
    fixed: {
      x: true,
      y: true
    }
  }
  
  options: vis.IOptions = { 
    nodes: this.node_options,
    physics: false
  }
  edge_dataset: vis.IEdge[] = [
    this.edge1
  ]
  stuff: vis.IData = {
    nodes: this.node_dataset,
    edges: this.edge_dataset
  };

  @ViewChild('network') network
  constructor(){

  }
  ngOnInit(){
    // var data: vis.DataItemCollectionType = []
    // var group: vis.DataGroupCollectionType = []
    var network = new vis.Network(this.network.nativeElement,this.stuff,this.options)
    network.redraw
    debugger
    console.log(network)
  }
}