import {Injectable} from '@angular/core';
import {
  CanActivate, Router, ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import {AppState} from '../app.state';
import {AppService} from './app.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private state: AppState,
    private service: AppService,
    private router: Router,
    private route: ActivatedRoute) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url, url.substring(1).split("/")[0]);
  }

  checkLogin(url: string, ctx: string): boolean {
    if (this.state.logged) {return true;}

    // Store the attempted URL for redirecting
    this.state.redirectUrl = url;

    // Navigate to the login page with extras
      this.router.navigate([ctx, 'prihlaseni']);
      return false;
      
  }
}