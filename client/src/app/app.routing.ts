import { Routes, RouterModule }   from '@angular/router';
import { PageNotFoundComponent }  from './components/404-page/404.component'
import { RailsRedirectComponent } from './rails-redirect/rails.component'
import { NodeGraphComponent2 } from './components/node-graph/node-graph.component'

const appRoutes: Routes = [
  { path: 'mbta-network', component: NodeGraphComponent2 },
  { path: '', component: RailsRedirectComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

export const routing = RouterModule.forRoot(appRoutes);