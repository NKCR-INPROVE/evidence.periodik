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
  public appState: AppState,
  private appservice: AppService) { }

  ngOnInit() {
    this.appservice.langSubject.subscribe(val=> {
      this.currentLang = val;
    });
    
    this.appState.stateChangedSubject.subscribe(val=> {
      this.menu = this.appState.config['menu'];
    });
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
    console.log(this.appState.actualNumber);
  }

}