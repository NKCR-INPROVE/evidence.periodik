import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { Http, Response, URLSearchParams } from '@angular/http';

import { AppState } from './app.state';
import { ListValue } from './models/list-value';

@Injectable()
export class AppService {

  //Observe language
  public _langSubject = new Subject();
  public langSubject: Observable<any> = this._langSubject.asObservable();

  constructor(
    private state: AppState,
    private translate: TranslateService,
    private http: Http) { }


  changeLang(lang: string) {
    //console.log('lang changed to ' + lang);
    this.state.currentLang = lang;
    this.translate.use(lang);
    this._langSubject.next(lang);
  }

  translateKey(key) {
    return this.translate.instant(key);
  }

  translateFromLists(classname: string, key: string): string {
    //console.log(this.state.lists, key, classname);
    if (this.state.lists &&
      this.state.lists.hasOwnProperty(classname +'_'+key)) {
      let listValue: ListValue = this.state.lists[classname + '_' + key];

      // find the lang in lists
      let lang = this.state.config['langMaps'].hasOwnProperty(this.state.currentLang) ?
        this.state.config['langMaps'][this.state.currentLang] : this.state.currentLang;
      if (listValue.hasOwnProperty(lang)) {
        return listValue[lang];
      } else if (listValue.cz) {
        return listValue.cz;
      } else {
        return key;
      }

    } else {
      return key;
    }
  }

  doSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();
    if (this.state.q && this.state.q !== '') {
      params.set('q', this.state.q);
    } else {
      params.set('q', '*');
    }

    params.set('start', this.state.start + '');
    params.set('rows', this.state.rows + '');
    params.set('facet', 'true');
    params.set('facet.mincount', '1');
    for (let i in this.state.config['facets']) {
      params.append('facet.field', this.state.config['facets'][i]['field']);
    }

    params.set('facet.range', 'rokvyd');
    params.set('facet.range.start', '0');
    params.set('facet.range.end', (new Date()).getFullYear() + '');
    params.set('facet.range.gap', '10');

    for (let i in this.state.usedFilters) {
      let fq = this.state.usedFilters[i].field + ':"' + this.state.usedFilters[i].value + '"';
      params.append('fq', fq);
    }

    if (this.state.currentCollapse['field'] !== 'id') {
      params.append('fq', '{!collapse field=' + this.state.currentCollapse['field'] + '}');
      params.append('expand', 'true');
      params.append('expand.rows', '1');
    }
    return params;
  }

  search(params: URLSearchParams, type: string = 'results'): void {
    this.state.startSearch(type);
    var url = this.state.config['context'] + 'search/rdcz/select';
    this.http.get(url, { search: params }).map(res => {
      this.state.processSearch(res.json(), type);
    }).subscribe();
  }



  getLists(): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('q', '*');
    let classes = 'dummyvalue'
    for (let i in this.state.config['facets']) {
      if(this.state.config['facets'][i]['classname']){
        classes += ' OR classname:"' + this.state.config['facets'][i]['classname'] + '"'
      }
    }
    params.append('fq', classes);
    params.set('rows', '1000');
    var url = this.state.config['context'] + 'search/lists/select';
    return this.http.get(url, { search: params }).map(res => {
      return res.json()['response']['docs'];
    });
  }

}
