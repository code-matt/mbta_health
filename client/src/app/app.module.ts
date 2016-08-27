import { NgModule }      from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http'
import { AppComponent }  from './app.component'
import { IndexPageComponent }  from './components/index-page/index.component'
import { PageNotFoundComponent }  from './components/404-page/404.component'
import { RailsRedirectComponent } from './rails-redirect/rails.component'
import { LoginFormComponent } from './components/login/login-form.component'
import { LoginPageComponent } from './components/login/login-page.component'
import { SignupPageComponent } from './components/signup/signup-page.component'
import { SignupFormComponent } from './components/signup/signup-form.component'
import { ThingService } from './services/thing.service'
import { AuthService } from './services/auth.service'
import { LoggedInGuard } from './shared/guards/logged-in.guard'
import { routing } from './app.routing';
import { MdMenuModule } from '@angular2-material/menu'
import { MdButtonModule } from '@angular2-material/button'
import { MdIconModule } from '@angular2-material/icon'
import { HeaderComponent } from './components/node-graph/header-controls.component'

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
    IndexPageComponent,
    LoginPageComponent,
    LoginFormComponent,
    SignupFormComponent,
    SignupPageComponent,
    RailsRedirectComponent,
    HeaderComponent
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
