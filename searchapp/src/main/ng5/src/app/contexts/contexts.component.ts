import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, NavigationEnd, NavigationStart} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {AppState} from 'app/app.state';
import {AppService} from 'app/services/app.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-contexts',
  templateUrl: './contexts.component.html',
  styleUrls: ['./contexts.component.scss']
})
export class ContextsComponent implements OnInit {

  subscription: Subscription;
  pathObserver: Subscription;
  paramsObserver: Subscription;
  
  hasContext: boolean = false;

  classes = {
    'home': 'app-page-home',
    'actual': 'app-page-actual',
    'o-casopisu': 'app-page-ocasopisu',
    'pro-autory': 'app-page-pokyny-pro-autory',
    'archiv': 'app-page-archiv-level-1',
    'article': 'app-page-archiv-reader',
    'hledat': 'app-page-search'
  };

  constructor(
    public state: AppState,
    private service: AppService,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => Observable.of(params['ctx'])).subscribe(ctx => {

        if (ctx) {

          if (this.state.ctxs) {
            this.state.ctx = this.service.getCtx(ctx);
            this.getConfig();
          } else {
            this.subscription = this.state.journalsInitilized.subscribe(cf => {
              this.state.ctx = this.service.getCtx(ctx);
              this.getConfig();
              
              this.subscription.unsubscribe();
            });
          }

        } else {
//          if (this.state.config) {
//            this.setCtx(true);
//            //this.setCtx(this.state.config['defCtx'], true);
//          } else {
//            this.subscription = this.state.configSubject.subscribe(cf => {
//              this.setCtx(true);
//              //this.setCtx(this.state.config['defCtx'], true);
//              this.subscription.unsubscribe();
//            });
//          }
        }
      });
  }

  setCtx(navigate: boolean) {
    //this.service.getJournalConfig(this.state.ctx).subscribe(res => {
      if (navigate) {
        this.router.navigate([this.state.ctx.ctx, 'home']);
      }
    //});
  }

  initApp() {
    var userLang = navigator.language.split('-')[0]; // use navigator lang if available
    userLang = /(cs|en)/gi.test(userLang) ? userLang : 'cs';
    if (this.state.config.hasOwnProperty('defaultLang')) {
      userLang = this.state.config['defaultLang'];
    }
    this.service.changeLang(userLang);
    this.setCtx(false);
    
    setTimeout(() => {
      this.processUrl();
      this.hasContext = true;
      this.state.stateChanged();
    }, 500);

  }

  getConfig() {
      return this.service.getJournalConfig(this.state.ctx).subscribe(res => {
        //return this.http.get("assets/config.json").map(res => {
        let cfg = res;
        if (!this.state.config) {
          this.state.setConfig(cfg);
        }
        this.initApp();
        return this.state.config;
      });
    
  }
  
  processUrl() {
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

    this.state.paramsChanged();
  }
  
  setMainClass(url: string) {
    let p = url.split('/');
    if (p.length > 2) {
      this.state.route = p[2].split(';')[0];
      this.state.mainClass = this.classes[this.state.route];
    }
  }


}
