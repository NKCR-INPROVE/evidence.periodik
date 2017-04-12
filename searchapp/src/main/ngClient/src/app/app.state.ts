import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import {ActualNumber} from './models/actual-number.model';
  
@Injectable()
export class AppState {

  private _stateSubject = new Subject();
  public stateChangedSubject: Observable<any> = this._stateSubject.asObservable();
  
  public _paramsSubject = new Subject();
  public paramsSubject: Observable<any> = this._paramsSubject.asObservable();
  
  //Holds client configuration
  config: any;
  
  //Holds start query parameter
  start: number = 0;

  //Holds number of rows per page. Default value from configuration
  rows: number = 10;

  sorts = [
    //{ "label": "Dle relevance", "field": "score desc" },
    { "label": "Dle idetifikatoru", "field": "uniqueid asc" },
    { "label": "Dle data", "field": "rok_vzniku desc" },
    { "label": "Dle autora", "field": "autor_sort asc" }
  ];
  currentSort: any = this.sorts[0];
  currentLang : string;
  
  public docs;
  
  //Aktualni cislo
  public actualNumber : ActualNumber;
  public imgSrc: string;
  
  setConfig(cfg){
    this.config = cfg;
  }
  
  //params
  paramsChanged(){    
    this._paramsSubject.next('');
  }
  
  //params
  stateChanged(){    
    this._stateSubject.next(this);
  }
  
  
  //Clear state vars
  clear() {
    this.docs = [];
  }
  
  setActual(a: ActualNumber){
    this.actualNumber = a;
    this.imgSrc = '/img?uuid=' + this.actualNumber.pid + '&stream=IMG_THUMB&action=SCALE&scaledWidth=220';
    this.stateChanged();
  }
}
