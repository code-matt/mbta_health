import { Routes, RouterModule }   from '@angular/router';
import { IndexPageComponent }  from './components/index-page/index.component'
import { PageNotFoundComponent }  from './components/404-page/404.component'
import { RailsRedirectComponent } from './rails-redirect/rails.component'
import { LoginPageComponent } from './components/login/login-page.component'
import { LoggedInGuard } from './shared/guards/logged-in.guard'

const appRoutes: Routes = [
  { path: 'index', component: IndexPageComponent, canActivate: [LoggedInGuard] },
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    component: RailsRedirectComponent,
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent },
];

export const routing = RouterModule.forRoot(appRoutes);