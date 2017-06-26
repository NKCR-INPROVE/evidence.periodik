import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  currentLang: string = 'cs';
  menu: any = {};

  constructor(
  public state: AppState,
  private appservice: AppService) { }

  ngOnInit() {
    this.appservice.langSubject.subscribe(val=> {
      this.currentLang = val;
    });
    
    this.state.stateChangedSubject.subscribe(val=> {
      this.menu = this.state.config['menu'];
    });
    
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
  
  ngOnDestroy(){
    
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
