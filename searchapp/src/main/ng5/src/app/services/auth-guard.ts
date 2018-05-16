import { Injectable }     from '@angular/core';
import {
  CanActivate, Router, ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';

import { AppState } from '../app.state';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private state: AppState, 
  private router: Router,
        private route: ActivatedRoute) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    //return true;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.state.logged) { return true; }

    // Store the attempted URL for redirecting
    this.state.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['prihlaseni'], { relativeTo: this.route });
    return false;
  }
}