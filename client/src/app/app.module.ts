import { NgModule }      from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http'
import { FORM_DIRECTIVES } from '@angular/common'
import { AppComponent }  from './app.component'
import { PageNotFoundComponent }  from './components/404-page/404.component'
import { RailsRedirectComponent } from './rails-redirect/rails.component'
import { ThingService } from './services/thing.service'
import { routing } from './app.routing';
import { MdMenuModule } from '@angular2-material/menu'
import { MdButtonModule } from '@angular2-material/button'
import { MdIconModule } from '@angular2-material/icon'
import { HeaderComponent } from './components/node-graph/header-controls.component'
import { SearchResultsComponent } from './components/node-graph/search-results.component'
import { SearchPipe } from './components/node-graph/search-results.pipe'

@NgModule({
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule,
    MdMenuModule,
    MdIconModule,
    MdButtonModule
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    RailsRedirectComponent,
    HeaderComponent,
    SearchResultsComponent,
    SearchPipe,
    FORM_DIRECTIVES
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    ThingService,
  ]
})
export class AppModule { }
