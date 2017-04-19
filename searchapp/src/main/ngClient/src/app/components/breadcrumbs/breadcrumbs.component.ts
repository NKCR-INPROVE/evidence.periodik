import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../../app.state';

import { AppService } from '../../services/app.service';


@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  
  //langObserver: Subscription;
  stateObserver: Subscription;
  routeObserver: Subscription;
  
  page : string = 'home';
  
  crumbs = [];

  constructor(private state: AppState,
    private appService: AppService,
    private router: Router) { }

  ngOnInit() {

    this.stateObserver = this.state.stateChangedSubject.subscribe(
      () => {
        this.setCrumbs();
      }
    );

    this.routeObserver = this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.page = val.url.substring(1);
        this.setCrumbs();
      }
    });
  }
  
  setCrumbs(){
    this.crumbs = [];
    this.crumbs.push({link: 'home', label: 'home'});
    if(this.page === 'home'){
      
    } else if(this.page.indexOf('article') === 0){
      
    } else if(this.page !== 'search'){
      let parts = this.page.split('/');
      for (let s = 0; s < parts.length; s++){
        let link = parts.slice(0, s+1);
        this.crumbs.push({link: link.join('/'), label: 'menu.'+link.join('.')+'_'});
      }
    }
  }

}
