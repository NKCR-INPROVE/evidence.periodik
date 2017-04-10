import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationExtras } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { AppService } from './services/app.service';
import { SearchService } from './services/search.service';
import { AppState } from './app.state';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  pathObserver: Subscription;
  paramsObserver: Subscription;
  
  
  constructor(
    private state: AppState,
    private searchService: SearchService,
    private appservice: AppService,
    private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private slimLoader: SlimLoadingBarService){
    
  }
  

  ngOnInit() {

    this.getConfig().subscribe(
      cfg => {
        
        this.state.stateChangedSubject.subscribe(route => { this.stateChanged(route)})

        this.processUrl();
      }
    );
  }
  
  getConfig() {
    return this.http.get("assets/config.json").map(res => {
      let cfg = res.json();
      
      this.state.config = cfg;
      this.state.rows = cfg['searchParams']['rows'];
      this.state.sorts = cfg['sorts'];
      this.state.currentSort = cfg[0];
      var userLang = navigator.language.split('-')[0]; // use navigator lang if available
      userLang = /(cs|en)/gi.test(userLang) ? userLang : 'cs';
      if(cfg.hasOwnProperty('defaultLang')){
        userLang = cfg['defaultLang'];
      }
      this.appservice.changeLang(userLang);
        
      //this._configSubject.next(cfg);
      //this.processUrl();
      return this.state.config;
    });
  }

  
  
  startProgress() {
    this.slimLoader.start(() => {
      console.log('Loading complete');
    });
  }

  completeProgress() {
    this.slimLoader.complete();
  }
  
  
  processUrl() {
    console.log('processUrl');
    this.pathObserver = this.router.events.subscribe(val => {
      console.log('pathObserver', val);
      if (val instanceof NavigationEnd) {
        this.state.paramsChanged();
      } else if (val instanceof NavigationStart ){
        this.state.clear();
      }
    });
    this.paramsObserver = this.route.queryParams.subscribe(searchParams => {
      this.processUrlParams(searchParams);
    });
    
    this.state.paramsChanged();
  }
  
  

  processUrlParams(searchParams) {
    for (let p in searchParams) {
      
    }
  }

  
  
  //Called when changing state
  stateChanged(route: string) {
    this.setUrl(route);
  }
  
  setUrl(route: string){
    
  }

}
