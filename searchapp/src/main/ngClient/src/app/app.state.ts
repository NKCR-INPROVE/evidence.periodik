import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import {Journal} from './models/journal.model';
  
@Injectable()
export class AppState {

  private _stateSubject = new Subject();
  public stateChangedSubject: Observable<any> = this._stateSubject.asObservable();

  private _classSubject = new Subject();
  public classChangedSubject: Observable<any> = this._classSubject.asObservable();
  
  public _paramsSubject = new Subject();
  public paramsSubject: Observable<any> = this._paramsSubject.asObservable();
  
  public _configSubject = new Subject();
  public configSubject: Observable<any> = this._configSubject.asObservable();
  
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
  public actualNumber : Journal;
  public imgSrc: string;
  
  public mainClass: string;
  
  public breadcrumbs = [];
  
  public route: string;
  
  
  public letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ];
  
  setConfig(cfg){
    this.config = cfg;
    this._configSubject.next(cfg);
  }
  
  //params
  paramsChanged(){    
    this._paramsSubject.next('');
  }
  
  //params
  stateChanged(){    
    this._stateSubject.next(this);
  }
  
  //params
  classChanged(){
    this._classSubject.next(this);
  }
  
  
  //Clear state vars
  clear() {
    this.docs = [];
  }
  
  setActual(a: Journal){
    this.actualNumber = a;
    this.imgSrc = this.config['context'] + 'img?uuid=' + this.actualNumber.pid + '&stream=IMG_THUMB&action=SCALE&scaledWidth=220';
    this.stateChanged();
  }
  
  setBreadcrumbs(){
    
  }
}
