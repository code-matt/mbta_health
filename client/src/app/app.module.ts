import { NgModule }      from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http'
import { routing } from './app.routing';
import { AppComponent }  from './app.component'
import { IndexPageComponent }  from './components/index-page/index.component'
import { PageNotFoundComponent }  from './components/404-page/404.component'
import { RailsRedirectComponent } from './rails-redirect/rails.component'
import { LoginFormComponent } from './components/login/login-form.component'
import { LoginPageComponent } from './components/login/login-page.component'
import { ThingService } from './services/thing.service'
import { AuthService } from './services/auth.service'
import { LoggedInGuard } from './shared/guards/logged-in.guard'

@NgModule({
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    IndexPageComponent,
    LoginPageComponent,
    LoginFormComponent,
    RailsRedirectComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    AuthService,
    ThingService,
    LoggedInGuard
  ]
})
export class AppModule { }
