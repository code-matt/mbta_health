import { NgModule }      from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http'
import { FORM_DIRECTIVES } from '@angular/common'
import { AppComponent }  from './app.component'
import { PageNotFoundComponent }  from './components/404-page/404.component'
import { RailsRedirectComponent } from './rails-redirect/rails.component'
import { NetworkGraphService } from './services/mbta-network.service'
import { AlertsService } from './services/realtime.service'
import { AlertSummaryComponent } from './components/node-graph/info/alert-summary.component'
import { routing } from './app.routing';
import { HeaderComponent } from './components/node-graph/header-controls.component'
import { SearchResultsComponent } from './components/node-graph/search-results.component'
import { SearchPipe } from './components/node-graph/search-results.pipe'
import { AlertsPipe } from './components/node-graph/alerts.pipe'
import { InfoPaneComponent } from './components/node-graph/info/info-pane.component'

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
    AlertSummaryComponent,
    InfoPaneComponent,
    SearchPipe,
    AlertsPipe,
    FORM_DIRECTIVES
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    NetworkGraphService,
    AlertsService
  ]
})
export class AppModule { }
