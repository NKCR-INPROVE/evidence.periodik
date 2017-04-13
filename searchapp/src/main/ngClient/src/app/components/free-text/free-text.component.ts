import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../../app.state';

import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-free-text',
  templateUrl: './free-text.component.html',
  styleUrls: ['./free-text.component.scss']
})
export class FreeTextComponent implements OnInit, OnDestroy {
  
  langObserver: Subscription;
  stateObserver: Subscription;
  routeObserver: Subscription;

  text: string;
  id: string;
  img: string = '';

  constructor(private state: AppState,
    private appService: AppService,
    private router: Router) { }

  ngOnInit() {
    this.setImg();
    this.langObserver = this.appService.langSubject.subscribe(
      () => {
        this.appService.getText(this.id).subscribe(t => this.text = t);
      }
    );

    this.stateObserver = this.state.stateChangedSubject.subscribe(
      () => {
        this.setImg();
      }
    );

    this.routeObserver = this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.id = val.url.substring(1);
        if (this.state.currentLang){
          this.appService.getText(this.id).subscribe(t => this.text = t);
        }
      }
    });

  }
  
  ngOnDestroy(){
    this.langObserver.unsubscribe();
    this.stateObserver.unsubscribe();
    this.routeObserver.unsubscribe();
  }

  setImg() {
    if (this.state.actualNumber) {
      this.img = this.state.imgSrc;
      //this.img = 'img/item/' + this.state.actualNumber.pid + '/thumb';
    }
  }

}
