import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  
  currentLang: string = 'cs';
  menu: any = {};

  constructor(
  public state: AppState,
  private appservice: AppService) { }

  ngOnInit() {
    this.subscriptions.push(this.appservice.langSubject.subscribe(val=> {
      this.currentLang = val;
    }));
    
    this.subscriptions.push(this.state.stateChangedSubject.subscribe(val=> {
      this.menu = this.state.config['menu'];
    }));
    
//    this.state.fullScreenSubject.subscribe(val=> {
//      if(!val){
//        setTimeout(()=>{
//          this.menu = this.state.config['menu'];
//        }, 100);
//        
//      } else {
//        this.menu = {};
//      }
//    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
  }
  
  isVisible(h: string, sub: string){
    if(this.menu.hasOwnProperty(h)){
      return this.menu[h][sub];
    } else {
      return false;
    }
  }
  
  changeLang(lang: string){
    this.appservice.changeLang(lang);
  }
  
  logActual(){
    console.log(this.state.actualNumber);
  }
  
  public isCollapsed: boolean = true;
}
