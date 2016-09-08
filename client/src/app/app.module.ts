import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'
import { FORM_DIRECTIVES } from '@angular/common'
import { AppComponent } from './app.component'
import { routing } from './app.routing';

import { PageNotFoundComponent } from './components/404-page/404.component'
import { RailsRedirectComponent } from './rails-redirect/rails.component'

import { NetworkGraphService } from './services/mbta-network.service'
import { AlertsService } from './services/realtime.service'

import { AlertSummaryComponent } from './components/node-graph/info-component/alert-summary.component'
import { ScheduleSummaryComponent } from './components/node-graph/info-component/schedule-summary.component'
import { InfoPaneComponent } from './components/node-graph/info-component/info-pane.component'
import { EpochPipe } from './components/node-graph/info-component/pipes/epochtime.pipe'
import { CountdownPipe } from './components/node-graph/info-component/pipes/countdown.pipe'

import { HeaderComponent } from './components/node-graph/header-component/header-controls.component'
import { SearchResultsComponent } from './components/node-graph/header-component/search-results.component'
import { UpdateTimerComponent } from './components/node-graph/header-component/update-timer.component'

import { SearchPipe } from './components/node-graph/pipes/search-results.pipe'
import { AlertsPipe } from './components/node-graph/pipes/alerts.pipe'
import { SchedulePipe } from './components/node-graph/pipes/schedule.pipe'
import { SelectionPipe } from './components/node-graph/pipes/selection.pipe'

import { NodeGraphComponent } from './components/node-graph/node-graph.component'
import { VisHelper } from './components/node-graph/vis-helper'

@NgModule({
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule,
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    RailsRedirectComponent,
    HeaderComponent,
    SearchResultsComponent,
    UpdateTimerComponent,
    AlertSummaryComponent,
    ScheduleSummaryComponent,
    InfoPaneComponent,
    EpochPipe,
    CountdownPipe,
    SearchPipe,
    AlertsPipe,
    SchedulePipe,
    SelectionPipe,
    FORM_DIRECTIVES
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    NetworkGraphService,
    AlertsService,
    VisHelper
  ]
})
export class AppModule { }
