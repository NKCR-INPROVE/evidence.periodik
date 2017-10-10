import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { AppState } from './app.state';

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
    console.log('lang changed to ' + lang);
    this.state.currentLang = lang;
    this.translate.use(lang);
    this._langSubject.next(lang);
  }
  
  getMagazines(): Observable<any> {
    var url = this.state.config['context'] + 'search/magazines/select';
    let params = new URLSearchParams();

    params.set('q', '*');
    params.set('wt', 'json');
    params.set('indent', 'true');
    params.set('json.nl', 'arrarr');
    params.set('facet', 'true');
    params.set('facet.mincount', '1');
    params.append('facet.field', 'pristup');
    params.append('facet.field', 'oblast');
    params.append('facet.field', 'keywords');
    
    for (let i in this.state.filters){
      let f: {field, value} = this.state.filters[i];
      params.append('fq', f.field + ':"' + f.value + '"');
    }
    
    this.state.clear();

    return this.http.get(url, { search: params })
      .map((response: Response) => {
        this.state.magazines = response.json()['response']['docs'];
        this.state.setFacets(response.json()['facet_counts']['facet_fields']);
        return this.state;
      });
  }
  
  getEditorMagazines(id: string): Observable<any> {
    var url = this.state.config['context'] + 'search/magazines/select';
    let params = new URLSearchParams();

    params.set('q', 'vydavatel_id:"' + id + '"');
    params.set('wt', 'json');
    params.set('indent', 'true');
    params.set('json.nl', 'arrarr');
    params.set('facet', 'true');
    params.set('facet.mincount', '1');
    params.append('facet.field', 'pristup');
    params.append('facet.field', 'oblast');
    params.append('facet.field', 'keywords');
    
    for (let i in this.state.filters){
      let f: {field, value} = this.state.filters[i];
      params.append('fq', f.field + ':"' + f.value + '"');
    }
    
    this.state.clear();

    return this.http.get(url, { search: params })
      .map((response: Response) => {
        this.state.magazines = response.json()['response']['docs'];
        this.state.setFacets(response.json()['facet_counts']['facet_fields']);
        return this.state;
      });
  }
  
  
  getEditors(): Observable<any> {
    var url = this.state.config['context'] + 'search/editors/select';
    let params = new URLSearchParams();

    params.set('q', '*');
    params.set('wt', 'json');
    params.set('indent', 'true');
    params.set('json.nl', 'arrntv');
    params.set('facet', 'true');
    params.set('facet.mincount', '1');
    params.append('facet.field', 'typ');
    
    this.state.clear();

    return this.http.get(url, { search: params })
      .map((response: Response) => {
        this.state.setEditors(response.json());
        return this.state;
      });
  }

}
