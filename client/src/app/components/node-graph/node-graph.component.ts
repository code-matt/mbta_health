import { 
  Component,
  OnInit,
  ViewChild, 
  Output, 
  EventEmitter,
  animate,
  trigger,
  state,
  style,
  transition
} from '@angular/core'
import { NetworkGraphService } from '../../services/mbta-network.service'
import { AlertsService } from '../../services/realtime.service'
import * as vis from 'vis'
import { HeaderComponent } from './header-controls.component.ts'

@Component({
  selector: 'node-graph',
  template: `
  <node-header (loadStation)="zoomToStation($event)" [nodes]="nodes"></node-header>
  <div class="row">
    <div class="col-lg-12">
      <div [@detailState]="state" #network class="mbta-network"></div>
      <div [@detailState2]="state" class="route-details"></div>
    </div>
  </div>
  `,
  styleUrls: ['node-graph.component.css'],
  animations: [
    trigger('detailState', [
      state('inactive', style({
        transform: 'scaleX(0.85) translateX(-15%)',
      })),
      state('active', style({
        transform: 'scaleX(1.0) translateX(0%)'
      })),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ]),
    trigger('detailState2', [
      state('inactive', style({
        transform: 'scaleX(25.0) translateX(-28%)',
      })),
      state('active', style({
        transform: 'scaleX(1.0) translateX(0%)'
      })),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ])
  ]
})
export class NodeGraphComponent2 implements OnInit {

  @ViewChild('network') network;
  state: string = 'active'

  constructor(
    private _thingService: NetworkGraphService,
    private _wsService: AlertsService){
    this._wsService.GetInstanceStatus().subscribe((result) => {
      if(result["type"] != "ping" && result["message"] != undefined)
      {
        console.log(JSON.parse(result["message"]))
      }
    });
  }

  private alerts: any
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
    var component = this

    this.network.on("selectNode", function (params) {
        component.state = 'inactive'
        console.log('selectNode Event:', params);
    });
    this.network.on("deselectNode", function (params) {
        component.state = 'active'
        console.log('deselectNode Event:', params);
    });
  }
  zoomToStation(node){
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