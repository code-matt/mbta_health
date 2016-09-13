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
import { HeaderComponent } from './header-component/header-controls.component.ts'
import { AlertSummaryComponent } from './info-component/alert-summary.component'
import { InfoPaneComponent } from './info-component/info-pane.component'
import { SearchPipe } from './pipes/search-results.pipe'
import { SelectionPipe } from './pipes/selection.pipe'
import { VisHelper } from './vis-helper'
import { Observable } from 'rxjs'

@Component({
  selector: 'node-graph',
  template: `
  <node-header (loadStation)="zoomToStation($event)" [nodes]="nodes" [updateCount]="updateCount" [status]="mbtaApiStatus"></node-header>
  <div class="row">
    <div class="col-lg-12">
      <div [ngClass]="{'graphSlideLeft':selected, 'graphSlideRight': !selected}" #network class="mbta-network"></div>
      <info-pane 
        #info
        [active]="selected"
        [alerts]="alerts" 
        [selected]="selected | SelectionPipe:nodes"
        [schedules]="schedules"
        [ticksSinceUpdate]="ticksSinceUpdate"
        (closeDetails)="closeDetails()"></info-pane>
    </div>
  </div>
  `,
  styleUrls: ['node-graph.component.css']
})
export class NodeGraphComponent implements OnInit {

  @ViewChild('network') network;
  @ViewChild('info') info;
  public state: string = 'active'
  public updateCount: number = 0
  public mbtaApiStatus: number = undefined

  constructor(
    private _graphService: NetworkGraphService,
    private _wsService: AlertsService,
    private _VisHelper: VisHelper) {

    this._VisHelper.parent = this
    var keepAlive = Observable.timer(0,2000)
    keepAlive.subscribe( e=> {
      if(this._wsService.getState() == 3 || this._wsService.getState() == -1){
        this.connectWs()
      }
    })
  }

  connectWs(){
    var component = this
    this._wsService.GetInstanceStatus().subscribe((result) => {
      if(result["type"] != "ping" && result["message"] != undefined)
      {
        var channel = JSON.parse(result.identifier).channel
      }
      if (channel == "AlertsChannel") {
        component.alerts = JSON.parse(result["message"])
        component._VisHelper.rebuildOptions()
        component.updateCount++
      }
      if (channel == "SchedulesChannel") {
        var schedules = JSON.parse(result["message"])
        component.schedules = schedules
        component.updateCount++
        component.resetTick()
      }
      if (channel == "StatusChannel") {
        this.mbtaApiStatus = Number(result["message"])
      }
    });
  }

  startTick(){
    let timer = Observable.timer(0,1000);
    timer.subscribe(t => this.ticksSinceUpdate++);
  }

  resetTick(){
    this.ticksSinceUpdate = 0
  }

  public ticksSinceUpdate: number = 0
  public alerts: any = { alerts: [] }
  public nodes: any = {}
  public schedules: any = {}
  public selected: any = undefined
  public routeAlerts =  {}

  ngOnInit() {
    this.loadData()
    this.startTick()
  }

  loadData() {
    this._graphService.getGraphData()
      .subscribe(
      data => {
        this.nodes = data;
        this.buildNetwork(this.nodes)
      },
      error => console.log(error))
  }

  buildNetwork(data) {
    for (var node in data.nodes) {
      node = data.nodes[node]
      var newNode: vis.INode = {
        x: Number(node["x"]),
        y: Number(node["y"]),
        id: node["node_id"],
        mbtaId: node["stop_name"],
        label: node["stop_name"],
        group: node["stop_name"]
      }
      this._VisHelper.node_dataset.push(newNode)
    }

    for (var edge in data.edges) {
      var id = edge;
      edge = data.edges[edge]

      var newEdge: vis.IEdge = {
        from: edge["from"],
        to: edge["to"],
        label: edge["route"],
        id: id,
        color: { color: edge["color"] },
        routeId: edge["routeId"],
        width: 30
      }
      this._VisHelper.edge_dataset.push(newEdge)
    }
    var network_data: vis.IData = {
      nodes: this._VisHelper.node_dataset,
      edges: this._VisHelper.edge_dataset
    };
    this.network = new vis.Network(
      this.network.nativeElement,
      network_data,
      this._VisHelper.buildOptions()
    )

    this._VisHelper.network = this.network
    var component = this

    this.network.on("selectNode", function (params) {
      component.state = 'inactive'
      var arr = component.nodes.nodes
      for (var node in arr) {
        if (arr[node]["node_id"] == params.nodes[0]) {
          component.selected = arr[node]
          return
        }
      }
    });
    this.network.on("deselectNode", function (params) {
      this.routes = []
      component.state = 'active'
      component.selected = undefined
    });
    this.network.on("optionsChange", function (options) {
      this.network.redraw()
    })
  }
  zoomToStation(node) {
    debugger
    this.hackSelect(node.node.node_id)
    var options = {
      scale: 0.35,
      offset: { x: 0, y: 0 },
      animation: {
        duration: 1300,
        easingFunction: "easeInOutQuad"
      }
    }
    this.network.focus(node.node.node_id, options)
  }
  hackSelect(node){
    this.network.selectNodes([node])
    this.network._callbacks.selectNode[0]({nodes:[node]})
  }
  closeDetails(){
    this.selected = undefined
    this.network.unselectAll()
  }
}