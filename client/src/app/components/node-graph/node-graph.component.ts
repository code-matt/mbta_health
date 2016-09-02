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
import { AlertSummaryComponent } from './info/alert-summary.component'
import { InfoPaneComponent } from './info/info-pane.component'
import { SearchPipe } from './search-results.pipe'

@Component({
  selector: 'node-graph',
  template: `
  <node-header (loadStation)="zoomToStation($event)" [nodes]="nodes"></node-header>
  <div class="row">
    <div class="col-lg-12">
      <div [@detailState]="state" #network class="mbta-network"></div>
      <info-pane [active]="selected" [alerts]="alerts | AlertsPipe:selected" #info></info-pane>
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
    ])
  ]
})
export class NodeGraphComponent2 implements OnInit {

  @ViewChild('network') network;
  @ViewChild('info') info;
  state: string = 'active'

  constructor(
    private _thingService: NetworkGraphService,
    private _wsService: AlertsService){
    this._wsService.GetInstanceStatus().subscribe((result) => {
      if(result["type"] != "ping" && result["message"] != undefined)
      {
        this.alerts = JSON.parse(result["message"])
        this.rebuildOptions()
        this.network.redraw()
      }
    });
  }

  private alerts: any = {alerts: []}
  private nodes: any = {}
  private selected: any = undefined
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
  
  options: vis.IOptions = {}
  
  buildOptions(){
    var groups = {}
    for(var node in this.nodes.nodes){
      groups[this.nodes.nodes[node]["mbta_id"]] = {
        color:'rgb(0,255,140)'
      }
    }
    var options = {
      nodes: this.node_options,
      edges: this.edge_options,
      groups: groups,
      physics: {
        enabled: false
      }}

    return options
  }

  rebuildOptions(){
    var groups = {}
    for(var node in this.nodes.nodes){
      for (var alert in this.alerts){
        var filter = this.alerts.alerts.filter(
          alert => alert["id"] == this.nodes.nodes[node]["mbta_id"])
        var color = filter.length > 0? 'red':'rgb(0,255,140)'

        groups[this.nodes.nodes[node]["mbta_id"]] = {
          color: color
        }
      }
    }
    var options = {
      nodes: this.node_options,
      edges: this.edge_options,
      groups: groups}

    this.network.setOptions(options)    
  }
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
        mbtaId: node["mbta_id"],
        label: node["stop_name"],
        group: node["mbta_id"]}
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
      this.buildOptions())

    var component = this

    this.network.on("selectNode", function (params) {
        component.state = 'inactive'
        console.log('selectNode Event:', params);
        var arr = component.nodes.nodes
        for (var node in arr){
          if (arr[node]["node_id"] == params.nodes[0]){
            component.selected = arr[node]["mbta_id"]
            return
          }
        }
    });
    this.network.on("deselectNode", function (params) {
        component.state = 'active'
        console.log('deselectNode Event:', params);
        component.selected = undefined
    });
    this.network.on("optionsChange", function(options){
      this.network.redraw()
    })
  }
  zoomToStation(node){
    debugger
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