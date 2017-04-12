import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {  Http, Response } from '@angular/http';


import {Observable, BehaviorSubject} from 'rxjs/Rx';

import {ActualNumber} from '../models/actual-number.model';

import { Subject } from 'rxjs/Subject';

import { AppState } from '../app.state';
import { SearchService } from './search.service';

@Injectable()
export class AppService {

  //Observe language
  public _langSubject = new Subject();
  public langSubject: Observable<any> = this._langSubject.asObservable();
  
  
  actualNumber: BehaviorSubject<ActualNumber> = new BehaviorSubject<ActualNumber>({
    pid: null, title:null, root_pid:null, root_title:null, model:null, details:null
    });
    
  
  constructor(
    private state: AppState,
    private search: SearchService,
    private translate: TranslateService,
    private http: Http
  ) { }
  
  
  changeLang(lang: string) {
    console.log('lang changed');
    this.state.currentLang = lang;
    this.translate.use(lang);
    this._langSubject.next(lang);
  }
  
  

  getActual(): Observable<ActualNumber> {
    return this.getActualByPid(this.state.config['journal']);
  }
  getActualByPid(pid: string): Observable<ActualNumber> {
    var url = this.state.config['api_point'] + '/item/' + pid + '/children';
    
    this.http.get(url)
      .map((response: Response) => {
        //console.log(response);
        let childs : any[] = response.json();
        let last = childs[childs.length - 1];
        if (last['model'] === this.state.config['model']){
          return {
            pid: last['pid'],
            title: last['title'],
            root_title: last['root_title'],
            root_pid: last['root_pid'],
            model: last['model'],
            details: last['details']
          };
        } else {
          return this.getActualByPid(last['pid']);
        }
      })
      .subscribe((result: ActualNumber) => this.actualNumber.next(result));

    return this.actualNumber;
  }
  
  getText(id : string): Observable<string>{
    var url = 'texts?id=' + id + '&lang=' + this.state.currentLang;
    
    return this.http.get(url).map((response: Response) => {
      return response.text();
    });
  }

}
