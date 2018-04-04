import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Journal } from '../models/journal.model';

import { Subject } from 'rxjs/Subject';

import { AppState } from '../app.state';
import { SearchService } from './search.service';
import { Criterium } from '../models/criterium';


import Utils from './utils';

declare var xml2json: any;

@Injectable()
export class AppService {

  //Observe language
  public _langSubject = new Subject();
  public langSubject: Observable<any> = this._langSubject.asObservable();

  //Observe searchs
  public _searchSubject = new Subject();
  public searchSubject: Observable<any> = this._searchSubject.asObservable();

  constructor(
    private state: AppState,
    private search: SearchService,
    private translate: TranslateService,
    private http: Http,
    private router: Router
  ) { }

  searchFired(criteria: Criterium[]) {
    this._searchSubject.next(criteria);
  }

  changeLang(lang: string) {
    console.log('lang changed to ' + lang);
    this.state.currentLang = lang;
    this.translate.use(lang);
    this._langSubject.next(lang);
  }

  getItem(pid: string): Observable<any> {
    var url = this.state.config['context'] + 'search/journal/select';
    let params = new URLSearchParams();

    params.set('q', 'pid:"' + pid + '"');
    params.set('wt', 'json');

    return this.http.get(url, { search: params })
      .map((response: Response) => {
        return response.json()['response']['docs'][0];
      });
  }

  getItemK5(pid: string): Observable<any> {
    var url = this.state.config['api_point'] + '/item/' + pid;

    return this.http.get(url)
      .map((response: Response) => {
        return response.json();
      });
  }

  getChildrenApi(pid: string): Observable<any> {
    var url = this.state.config['api_point'] + '/item/' + pid + '/children';

    return this.http.get(url)
      .map((response: Response) => {
        return response.json();
      });
  }

  getChildren(pid: string, dir: string = 'desc'): Observable<any> {
    var url = this.state.config['context'] + 'search/journal/select';
    let params = new URLSearchParams();

    params.set('q', '*:*');
    params.set('fq', 'parents:"' + pid + '"');
    params.set('wt', 'json');
    params.set('sort', 'idx ' + dir);
    params.set('rows', '500');

    return this.http.get(url, { search: params })
      .map((response: Response) => {
        return response.json()['response']['docs'];
      });
  }

//  getActual(): Observable<Journal> {
//    return this.getJournalByPid(this.state.config['journal'], this.state.config['model']);
//  }

  getJournal(pid: string): Observable<Journal> {

    var url = this.state.config['context'] + 'search/journal/select';
    let params = new URLSearchParams();

    params.set('q', 'pid:"' + pid + '"');
    params.set('wt', 'json');
    params.set('rows', '1');


    return this.http.get(url, { search: params }).map((response: Response) => {
      let j = response.json()['response']['docs'][0];

      let ret = new Journal();
      ret.pid = j['pid'];
      ret.parent = j['parents'][0];
      ret.title = j['title'];
      ret.root_title = j['root_title'];
      ret.root_pid = j['root_pid'];
      ret.model = j['model'];
      ret.details = j['details'];
      ret.year = j['year'];
      ret.siblings = null;
      ret.mods = JSON.parse(j['mods']);
      ret.genres = [];
      ret.genresObject = {};

      return ret;
    });
  }

  getJournalK5(pid: string): Observable<Journal> {

    var url = this.state.config['api_point'] + '/item/' + pid;


    return this.http.get(url).map((response: Response) => {
      //console.log(response);
      let j = response.json();

      let ret = new Journal();
      ret.pid = j['pid'];
      ret.title = j['title'];
      ret.root_title = j['root_title'];
      ret.root_pid = j['root_pid'];
      ret.model = j['model'];
      ret.details = j['details'];
      ret.siblings = null;
      ret.mods = null;
      ret.genres = [];
      ret.genresObject = {};

      return ret;
    });
  }

//  getJournalByPid(pid: string, model: string): Observable<Journal> {
//    var url = this.state.config['api_point'] + '/item/' + pid + '/children';
//
//    return this.http.get(url).map((response: Response) => {
//      let childs: any[] = response.json();
//      //console.log(pid, childs);
//      let last = childs[childs.length - 1];
//      if (childs.length === 0) {
//        return new Journal();
//      }
//      if (last['model'] === model) {
//        let ret = new Journal();
//        ret.pid = last['pid'];
//        ret.title = last['title'];
//        ret.root_title = last['root_title'];
//        ret.root_pid = last['root_pid'];
//        ret.model = last['model'];
//        ret.details = last['details'];
//        ret.siblings = childs;
//        ret.mods = null;
//        ret.genres = [];
//        ret.genresObject = {};
//
//        return ret;
//      } else {
//        return this.getJournalByPid(last['pid'], model).switch();
//      }
//    });
//  }

  setArticles1(ret: Journal, res1) {
    let res = res1['response']['docs'];
    for (let i in res) {
      let art = res[i];
      if (art && art['pid']) {
        this.getMods(art['pid']).subscribe(mods => {
          art['mods'] = mods;
          //let mods = bmods["mods:modsCollection"]["mods:mods"];
          let genre = Utils.getJsonValue(mods, "mods:genre");
          if (genre.hasOwnProperty('type')) {
            art['genre'] = genre['type'];
          } else if (genre.hasOwnProperty('length')) {
            for (let i in genre) {
              art['genre'] = genre[i]['type'];
            }
          }
          if (this.isGenreVisible(art['genre'])) {
            if (ret.genresObject.hasOwnProperty(art['genre'])) {
              ret.genresObject[art['genre']]['articles'].push(art);
            } else {
              ret.genres.push(art['genre']);
              ret.genresObject[art['genre']] = {};
              ret.genresObject[art['genre']]['articles'] = [];
              ret.genresObject[art['genre']]['articles'].push(art);
            }
          }
          //            if (this.service.getJsonValue(mods, "mods:genre") !== null){
          //            }
        });
      }
    }
  }

  isGenreVisible(genre: string): boolean {
    return genre !== 'cover' &&
      genre !== 'advertisement' &&
      genre !== 'colophon';
  }

  getArticles(pid: string): Observable<any[]> {
    const getRange = (pid: string): Observable<any> => {

      var url = this.state.config['context'] + 'search/journal/select';
      let params = new URLSearchParams();

      params.set('q', '*:*');
      params.set('fq', 'parents:"' + pid + '"');
      //params.set('fq', 'model:"article"');
      params.set('wt', 'json');
      params.set('sort', 'idx asc');
      params.set('rows', '500');

      return this.http.get(url, { search: params });
    };

    return getRange(pid).expand((res) => {

      //    if (res.status ===       206) {
      //      const nextRange = res.headers.get('Next-R      ang      e');
      //
      //      return getRange(next      Range);
      //    }       else {
      //      return Observable.e      mpty();
      //    }


      let articles = [];
      let childs: any[];
      if (res.json) {
        childs = res.json()['response']['docs'];
      } else {
        childs = res;
      }
      for (let ch in childs) {
        if (childs[ch]['model'] === 'article') {
          articles.push(childs[ch]);
        }
      }

      if (articles.length > 0) {
        //return Observable.of(articles);
        //return articles;
        return Observable.empty();
      } else {
        if (childs.length > 0) {
          return getRange(childs[0]['pid']);
        } else {
          return Observable.empty();
        }
      }

    }).map((res) => {
      return res.json();
    });
  }
  
  
  public modsCache = {};

  getMods(pid: string): Observable<any> {
    if (this.modsCache.hasOwnProperty(pid)){
      return Observable.of(this.modsCache[pid]);
    }
    let url = this.state.config['context'] + 'search/journal/select';
    let params = new URLSearchParams();

    params.set('q', '*:*');
    params.set('fq', 'pid:"' + pid + '"');
    params.set('wt', 'json');
    params.set('fl', 'mods');

    return this.http.get(url, { search: params })
      .map((response: Response) => {
        this.modsCache[pid] = response.json()['response']['docs'][0]['mods'];
        return this.modsCache[pid];
      });
  }

  setViewed(pid: string): Observable<any> {
      let url = this.state.config['context'] + 'index';
    let params = new URLSearchParams();

    params.set('action', 'SET_VIEW');
    params.set('pid',  pid);
    return this.http.get(url, { search: params })
      .map((response: Response) => {
        return response.json();

      });
      
      
//    let url = this.state.config['context'] + 'search/views/update';
//    let headers = new Headers({ 'Content-Type': 'application/json' });
//    let options = new RequestOptions({ headers: headers });
//    let add = { add: { doc: {}, commitWithin: 10 } };
//    let body = add['add']['doc'];
//    body['pid'] = pid;
//    body['views'] = { 'inc': 1 };

//    return this.http.post(url, JSON.stringify(add), options)
//      .map((response: Response) => {
//        return response.json();
//
//      });
  }

  getViewed(pid: string): Observable<number> {
    let url = this.state.config['context'] + 'search/views/select';
    let params = new URLSearchParams();

    params.set('q', '*:*');
    params.set('fq', 'pid:"' + pid + '"');
    params.set('wt', 'json');
    params.set('fl', 'views');

    return this.http.get(url, { search: params })
      .map((response: Response) => {
        if (response.json()['response']['numFound'] > 0) {
          return response.json()['response']['docs'][0]['views'];
        } else {
          return 0;
        }

      });
  }


  getModsK5(pid: string): Observable<any> {
    let url = this.state.config['api_point'] + '/item/' + pid + '/streams/BIBLIO_MODS';
    return this.http.get(url).map((res: Response) => {

      return JSON.parse(xml2json(res.text(), ''))["mods:modsCollection"]["mods:mods"];
    });
  }

  getSiblings(pid: string): Observable<any> {
    let url = this.state.config['context'] + 'search/journal/select';
    let params = new URLSearchParams();

    params.set('q', 'pid:"' + pid + '"');
    params.set('wt', 'json');
    params.set('fl', 'parents');

    return this.http.get(url, { search: params })
      .map((response: Response) => {
        let parent = response.json()['response']['docs'][0]['parents'][0];
        return this.getChildren(parent).subscribe();
      });
  }

  getSiblingsk5(pid: string): Observable<any> {
    let url = this.state.config['api_point'] + '/item/' + pid + '/siblings';
    return this.http.get(url).map((res: Response) => {

      return res.json()[0]['siblings'];
    });
  }

  getUploadedFiles(): Observable<any> {
    var url = 'lf?action=LIST';

    return this.http.get(url).map((response: Response) => {
      return response.json();
    }).catch(error => { return Observable.of('error gettting content: ' + error); });
  }

  getText(id: string): Observable<string> {
    var url = 'texts?action=LOAD&id=' + id + '&lang=' + this.state.currentLang;

    return this.http.get(url).map((response: Response) => {
      return response.text();
    }).catch(error => { return Observable.of('error gettting content: ' + error); });
  }

  saveText(id: string, text: string, menu: string = null): Observable<string> {
    
    //var url = 'texts?action=SAVE&id=' + id + '&lang=' + this.state.currentLang;
    var url = 'texts';
    
    var params = new URLSearchParams();
    params.set('user', this.state.loginuser);
    params.set('id', id);
    params.set('action', 'SAVE');
    params.set('lang', this.state.currentLang);
    
    if(menu){
      params.set('menu', menu);
      //url += '&menu=' + menu;
    }

    let headers = new Headers({ 'Content-Type': 'text/plain;charset=UTF-8' });
    let options = new RequestOptions({ headers: headers, search: params });

      
    return this.http.post(url, text, options)
      .map((response: Response) => {
        return response.json();

      }).catch(error => { return Observable.of('error saving content: ' + error); });

  }
  
  index(uuid: string){
    var url = 'index?action=INDEX_DEEP&pid=' + uuid;

    return this.http.get(url)
      .map((response: Response) => {
        return response.json();

      }).catch(error => { return Observable.of('error indexing uuid: ' + error); });

  }

  login() {
    this.state.loginError = false;
    return this.doLogin().subscribe(res => {
        console.log(res);
      if (res.hasOwnProperty('error')) {
        this.state.loginError = true;
        this.state.logged = false;
      } else {
      
        this.state.loginError = false;
        this.state.loginuser = '';
        this.state.loginpwd = '';
        this.state.logged = true;
        if (this.state.redirectUrl) {
          this.router.navigate([this.state.redirectUrl]);
        }
      }
    });
  }

  doLogin() {
    var url = 'login'
    var params = new URLSearchParams();
    params.set('user', this.state.loginuser);
    params.set('pwd', this.state.loginpwd);
    params.set('action', 'LOGIN');
    return this.http.get(url, { search: params }).map(res => {
      return res.json();
    }, error => {
      console.log('error : ' + error);
    });

  }

  logout() {
    this.doLogout().subscribe(res => {
      if (res.hasOwnProperty('error')) {
        console.log(res['error']);
      }
      this.state.logged = false;
      this.router.navigate(['/home']);
    });
  }

  doLogout() {

    var url = 'login';
    //console.log(this.loginuser, this.loginpwd, url);
    var params = new URLSearchParams();
    params.set('action', 'LOGOUT');
    return this.http.get(url, { search: params }).map(res => {
      return res.json();
    });

  }

  isHiddenByGenre(genres: string[]) {
    //console.log(this.state.config['hiddenGenres'], genres);
    for (let g in genres) {
      //console.log(g);
      if (this.state.config['hiddenGenres'].indexOf(genres[g]) > -1) {
        return true;
      }
    }
    return false;
  }


}
