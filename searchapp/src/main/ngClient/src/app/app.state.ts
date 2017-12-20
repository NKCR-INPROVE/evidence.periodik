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

  private _fullScreenSubject = new Subject();
  public fullScreenSubject: Observable<any> = this._fullScreenSubject.asObservable();
  
  public _paramsSubject = new Subject();
  public paramsSubject: Observable<any> = this._paramsSubject.asObservable();
  
  public _configSubject = new Subject();
  public configSubject: Observable<any> = this._configSubject.asObservable();
  
  //Holds client configuration
  config: any;
  
  loginuser: string;
  loginpwd: string;
  loginError: boolean = false;
  logged: boolean = false;
  redirectUrl: string = '/admin';
  
  //Holds start query parameter
  start: number = 0;

  //Holds number of rows per page. Default value from configuration
  rows: number = 10;

  sorts = [
    { "label": "dle relevance", "field": "score desc" },
    { "label": "od nejnovějších", "field": "year desc" },
    { "label": "od nejstarších", "field": "year asc" },
    { "label": "podle názvu A-Z", "field": "title_sort asc" }
    
  ];
  currentSort: any = this.sorts[0];
  currentLang : string;
  
  public docs;
  
  //Aktualni cislo
  public actualNumber : Journal;
  public imgSrc: string;
  public krameriusUrl: string;
  
  public mainClass: string;
  
  //Controls full screen viewer
  public isFull: boolean = false;
  
  public breadcrumbs = [];
  
  
    dateMin: number = 2000;
    dateMax: number = 2019;
    dateOd: number = 2000;
    dateDo: number = 2019;
    dateRange: number[] = [0, 1];
  
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
  
  resetDates() {
        this.dateOd = this.dateMin;
        this.dateDo = this.dateMax;
        this.dateRange = [this.dateOd, this.dateDo];
    }
  
  setConfig(cfg){
    this.config = cfg;
    this.krameriusUrl = this.config['k5'] + this.config['journal'];
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
  
  fullScreenChanged(b: boolean){
    
    this.isFull = b;
    this._fullScreenSubject.next(b);
  }
  
  
  //Clear state vars
  clear() {
    this.docs = [];
  }
  
  setActual(a: Journal){
    this.actualNumber = a;
    this.imgSrc = this.config['context'] + 'img?obalka=true&uuid=' + this.actualNumber.pid + '&stream=IMG_THUMB&action=SCALE&scaledWidth=220';
    //this.imgSrc = this.config['context'] + 'img?obalka=true';
    this.stateChanged();
  }
  
  setBreadcrumbs(){
    
  }
}
