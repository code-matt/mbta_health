import { Routes, RouterModule }   from '@angular/router';
import { IndexPageComponent }  from './components/index-page/index.component'
import { PageNotFoundComponent }  from './components/404-page/404.component'
import { RailsRedirectComponent } from './rails-redirect/rails.component'

const appRoutes: Routes = [
  { path: 'index', component: IndexPageComponent },
  {
    path: '',
    component: RailsRedirectComponent,
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent },
];

export const routing = RouterModule.forRoot(appRoutes);