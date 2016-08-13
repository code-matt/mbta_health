import { NgModule }      from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { routing } from './app.routing';
import { AppComponent }  from './app.component'
import { IndexPageComponent }  from './components/index-page/index.component'
import { PageNotFoundComponent }  from './components/404-page/404.component'
import { RailsRedirectComponent } from './rails-redirect/rails.component'
import { ThingService } from './services/thing.service'

@NgModule({
  imports: [
    BrowserModule,
    routing,
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    IndexPageComponent,
    RailsRedirectComponent
  ],
  bootstrap: [
    AppComponent,
  ],
  providers: [
    ThingService, 
  ]
})
export class AppModule { }