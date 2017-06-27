import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationExtras } from '@angular/router';

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

  classes = {
    'home': 'app-page-home',
    'actual': 'app-page-actual',
    'o-casopisu': 'app-page-ocasopisu',
    'pro-autory': 'app-page-pokyny-pro-autory',
    'archiv': 'app-page-archiv-level-1',
    'article': 'app-page-archiv-reader',
    'hledat': 'app-page-search'
  };
  mainClass: string = this.classes['home'];
  pidActual: string;

  constructor(
    public state: AppState,
    private service: AppService,
    private http: Http,
    private route: ActivatedRoute,
    private router: Router) {

  }


  ngOnInit() {

    this.getConfig().subscribe(
      cfg => {

        this.state.stateChangedSubject.subscribe(route => { 
          this.stateChanged(route) ;
          });
          
        this.state.classChangedSubject.subscribe(() => { 
          this.classChanged() ;
          });

        this.processUrl();
      }
    );
  }

  getConfig() {
    return this.http.get("assets/config.json").map(res => {
      let cfg = res.json();

      this.state.setConfig(cfg);
      this.state.rows = cfg['searchParams']['rows'];
      this.state.sorts = cfg['sorts'];
      this.state.currentSort = cfg[0];
      var userLang = navigator.language.split('-')[0]; // use navigator lang if available
      userLang = /(cs|en)/gi.test(userLang) ? userLang : 'cs';
      if (cfg.hasOwnProperty('defaultLang')) {
        userLang = cfg['defaultLang'];
      }
      this.service.changeLang(userLang);
      
      this.findActual();
      //this._configSubject.next(cfg);
      //this.processUrl();
      this.state.stateChanged();
      return this.state.config;
    });
  }
  
  
  findActual(){
    this.pidActual = null;
    this.findActualByPid(this.state.config['journal']);
  }
  
  findActualByPid(pid: string){
    this.service.getChildren(pid).subscribe(res => {
      if(res.length === 0){
        this.pidActual = null;
        console.log('ERROR. Cannot find actual number');
      } else if(res[0]['datanode']){
        this.pidActual = pid;
        this.service.getJournal(pid).subscribe(a => {
          this.state.setActual(a);
          this.service.getArticles(this.state.actualNumber['pid']).subscribe(res => {
            this.state.actualNumber.setArticles(res);
            //this.service.getMods(this.state.actualNumber['pid']).subscribe(mods => this.state.actualNumber.mods = mods);
            this.state.stateChanged();
          });
        });
      } else {
        this.findActualByPid(res[0]['pid']);
      }
    });
  }

  processUrl() {
    //this.searchService.getActual();
    this.setMainClass(this.router.url);
    this.pathObserver = this.router.events.subscribe(val => {
      //console.log('pathObserver', val);
      if (val instanceof NavigationEnd) {
        this.state.paramsChanged();
        this.setMainClass(val.url);
      } else if (val instanceof NavigationStart) {
        this.state.clear();
      }
    });
    
//    this.route..subscribe(data => {
//      console.log(this.route.outlet);
//    });

    this.paramsObserver = this.route.queryParams.subscribe(searchParams => {
      this.processUrlParams(searchParams);
    });

    this.state.paramsChanged();
  }

  setMainClass(url: string) {
    let p = url.split('/');
    this.state.route = p[1].split(';')[0];
    this.state.mainClass = this.classes[this.state.route];
    this.mainClass = this.classes[this.state.route];
  }

  processUrlParams(searchParams) {
    for (let p in searchParams) {

    }
  }

  //Called when changing state
  stateChanged(route: string) {
    this.setUrl(route);
  }
  
  classChanged(){
    this.mainClass = this.state.mainClass;
  }

  setUrl(route: string) {

  }

}
