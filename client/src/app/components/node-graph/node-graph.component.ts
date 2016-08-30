import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core'
import { NetworkGraphService } from '../../services/mbta-network.service'
import * as vis from 'vis'
import { HeaderComponent } from './header-controls.component.ts'

@Component({
  selector: 'node-graph',
  template: `
  <node-header (loadStation)="zoomStation($event)" [nodes]="nodes"></node-header>
  <div class="row">
    <div class="col-lg-12">
      <div #network class="mbta-network"></div>
    </div>
  </div>
  `,
  styleUrls: ['node-graph.component.css'] 
})
export class NodeGraphComponent2 implements OnInit {

  @ViewChild('network') network;

  constructor(
    private _thingService: NetworkGraphService){
  }

  private nodes: any = {}
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
  
  options: vis.IOptions = { 
    nodes: this.node_options,
    edges: this.edge_options}

  ngOnInit(){
    this.loadData()
  }
  loadData(){
    this._thingService.getThings()
      .subscribe(
        data => {
          this.nodes = data;
          this.buildNetwork(this.nodes)
        },
        error => console.log(error))
  }
  buildNetwork(data){
    for (var node in data.nodes){
      node = data.nodes[node]
      var newNode: vis.INode = {
        x: Number(node["x"]),
        y: Number(node["y"]),
        id: node["node_id"],
        label: node["stop_name"]}
      this.node_dataset.push(newNode)
    }

    for (var edge in data.edges){
      var id = edge;
      edge = data.edges[edge]

      var newEdge: vis.IEdge = {
        from: edge["from"],
        to: edge["to"],
        label: edge["route"],
        id: id,
        color:{color: edge["color"]}}

      this.edge_dataset.push(newEdge)
    }
    var network_data: vis.IData = {
      nodes: this.node_dataset,
      edges: this.edge_dataset
    };
    this.network = new vis.Network(
      this.network.nativeElement,
      network_data,
      this.options)

    this.network.redraw
    this.network.on("selectEdge",function(data){
      
    })
  }
  zoomStation(node){
    var options = {
      scale: 0.35,
      offset: {x:0,y:0},
      animation: {
        duration: 1300,
        easingFunction: "easeInOutQuad"
      }
    }
    this.network.focus(node.node.node_id,options)
  }
}