import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
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
  params : string = '';
  
  crumbs = [];

  constructor(private state: AppState,
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    this.stateObserver = this.state.stateChangedSubject.subscribe(
      () => {
        this.setCrumbs();
      }
    );

    this.routeObserver = this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        console.log(val);
        let url = val.urlAfterRedirects.substring(1);
        this.page = url.split(";")[0];
        if (url.split(";").length > 1){
          this.params = url.split(";")[1];
        } else {
          this.params = '';
        }
        this.setCrumbs();
      }
    });
  }
  
  setCrumbs(){
    this.crumbs = [];
    this.crumbs.push({link: 'home', label: 'menu.home_'});
    if(this.page === 'home'){
      
    } else if(this.page.indexOf('article') === 0){
      
//    } else if(this.page.indexOf('hledat') === 0){
//      
//      console.log(this.route.snapshot);
//      console.log(this.route.snapshot.children[0].url[0].path);
      
    } else if (this.page !== 'search'){
      let parts = this.page.split('/');
      for (let s = 0; s < parts.length; s++){
        let link = parts.slice(0, s+1);
        this.crumbs.push({link: link.join('/'), label: 'menu.'+link.join('.')+'_'});
      }
    } 
  }

}
