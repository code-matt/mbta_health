import { provideRouter, RouterConfig } from '@angular/router';

import { RailsResolver, RailsResolveFunction } from './resolver/rails.resolver';
import { Rails } from './resolver/rails.component';
import { PageNotFoundComponent } from './shared/404.component'
import { IndexPageComponent } from './components/index-page/index.component'

const routes: RouterConfig = [
  { path: 'index', component: IndexPageComponent },
  {
    path: '',
    component: Rails,
    pathMatch: 'full',
    resolve: { data: 'RailsResolveFunction' }
  },
  { path: '**', component: PageNotFoundComponent }
];

export const appRouterProviders = [
  provideRouter(routes, { enableTracing: false }),
  RailsResolver,
  { provide: 'RailsResolveFunction', useValue: RailsResolveFunction }
];
