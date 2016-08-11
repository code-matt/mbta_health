import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteSnapshot} from '@angular/router';
import {RouterStateSnapshot} from '@angular/router';

@Injectable()
export class RailsResolver {
  constructor() {}
}

export function RailsResolveFunction(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  return state.queryParams;
}
