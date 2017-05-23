import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Journal } from '../models/journal.model';

import { Subject } from 'rxjs/Subject';

import { AppState } from '../app.state';
import { SearchService } from './search.service';
import { Criterium } from '../models/criterium';

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
    private http: Http
  ) { }

  searchFired(criteria: Criterium[]){
    this._searchSubject.next(criteria);
  }
  
  changeLang(lang: string) {
    console.log('lang changed to ' + lang);
    this.state.currentLang = lang;
    this.translate.use(lang);
    this._langSubject.next(lang);
  }

  getItem(pid: string): Observable<any> {
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

  getChildren(pid: string): Observable<any> {
    var url = '/search/journal/select';
    let params = new URLSearchParams();

    params.set('q', '*:*');
    params.set('fq', 'parents:"' + pid + '"');
    params.set('wt', 'json');
    params.set('sort', 'idx asc');
    params.set('rows', '500');

    return this.http.get(url, { search: params })
      .map((response: Response) => {
        return response.json()['response']['docs'];
      });
  }

  getActual(): Observable<Journal> {
    return this.getJournalByPid(this.state.config['journal'], this.state.config['model']);
  }

  getJournal(pid: string): Observable<Journal> {

    var url = '/search/journal/select';
      let params = new URLSearchParams();

      params.set('q', 'pid:"' + pid + '"');
      params.set('wt', 'json');
      params.set('rows', '1');


    return this.http.get(url, {search: params}).map((response: Response) => {
      console.log(response);
      let j = response.json()['response']['docs'][0];

      let ret = new Journal();
      ret.pid = j['pid'];
      ret.parent = j['parents'][0];
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

  getJournalByPid(pid: string, model: string): Observable<Journal> {
    var url = this.state.config['api_point'] + '/item/' + pid + '/children';

    return this.http.get(url).map((response: Response) => {
      //console.log(response);
      let childs: any[] = response.json();
      let last = childs[childs.length - 1];
      if (childs.length === 0) {
        return new Journal();
      }
      if (last['model'] === model) {
        let ret = new Journal();
        ret.pid = last['pid'];
        ret.title = last['title'];
        ret.root_title = last['root_title'];
        ret.root_pid = last['root_pid'];
        ret.model = last['model'];
        ret.details = last['details'];
        ret.siblings = childs;
        ret.mods = null;
        ret.genres = [];
        ret.genresObject = {};

        return ret;
      } else {
        return this.getJournalByPid(last['pid'], model);
      }
    });
  }

  setArticles1(ret: Journal, res1) {
    let res = res1['response']['docs'];
    for (let i in res) {
      let art = res[i];
      if (art && art['pid']) {
        this.getMods(art['pid']).subscribe(mods => {
          art['mods'] = mods;
          //let mods = bmods["mods:modsCollection"]["mods:mods"];
          let genre = this.getJsonValue(mods, "mods:genre");
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

      var url = '/search/journal/select';
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


  getArticles2(pid: string): Observable<any[]> {
    console.log('getArticles', pid);
    var url = '/search/journal/select';
    let params = new URLSearchParams();

    params.set('q', '*:*');
    params.set('fq', 'parents:"' + pid + '"');
    //params.set('fq', 'model:"article"');
    params.set('wt', 'json');
    params.set('sort', 'idx asc');
    params.set('rows', '500');

    return this.http.get(url, { search: params }).map((response: Response) => {
      //return response.json()['response']['docs'];
      let articles = [];
      let childs: any[] = response.json()['response']['docs'];

      for (let ch in childs) {
        if (childs[ch]['model'] === 'article') {
          articles.push(childs[ch]);
        }
      }

      if (articles.length > 0) {
        console.log("articles", articles);
        return articles;
      } else {
        if (childs.length > 0) {
          return Observable.forkJoin([
            Observable.of([]),
            this.getArticles(childs[0]['pid']).map(res => res)
          ]);
          //return this.getArticles(childs[0]['pid']).subscribe();
        } else {
          return Observable.of([]);
        }
      }


    });
  }


  getArticlesApi(pid: string): Observable<any[]> {
    let url = this.state.config['api_point'] + '/item/' + pid + '/children';
    //    let url = this.state.config['api_point'] + '/search';
    //    url += '?q=parent_pid:' + pid.replace(':', '\\:') + '' + '&fq=fedora.model:article';

    return this.http.get(url).map((response: Response) => {
      //return response.json()['response']['docs'];
      let articles = [];
      let childs: any[] = response.json();

      for (let ch in childs) {
        if (childs[ch]['model'] === 'article') {
          articles.push(childs[ch]);
        }
      }

      if (articles.length > 0) {
        return articles;
      } else {
        if (childs.length > 0) {
          return this.getArticles(childs[0]['pid']);
        } else {
          return Observable.of([]);
        }
      }


    });
  }


  getMods(pid: string): Observable<any> {
    let url = '/search/journal/select';
    let params = new URLSearchParams();

    params.set('q', '*:*');
    params.set('fq', 'pid:"' + pid + '"');
    params.set('wt', 'json');
    params.set('fl', 'mods');

    return this.http.get(url, { search: params })
      .map((response: Response) => {
        return JSON.parse(response.json()['response']['docs'][0]['mods']);
      });
  }

  setViewed(pid: string): Observable<any> {
    let url = '/search/views/update';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let add = {add: {doc:{}, commitWithin:10}};
    let body = add['add']['doc'];
    body['pid'] = pid;
    body['views'] = {'inc': 1};
    
    return this.http.post(url, JSON.stringify(add), options)
      .map((response: Response) => {
        return response.json();

      });
  }

  getViewed(pid: string): Observable<number> {
    let url = '/search/views/select';
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
    let url = '/search/journal/select';
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

  getText(id: string): Observable<string> {
    var url = 'texts?id=' + id + '&lang=' + this.state.currentLang;

    return this.http.get(url).map((response: Response) => {
      return response.text();
    }).catch(error => { return Observable.of('error gettting content: ' + error); });
  }

  /**
   * Utility for get json value from path 
   * Test if json object has that value first
   * If not returns null
   */
  getJsonValue(json, path: string) {
    let parts = path.split('/');
    let l = parts.length;
    let i: number = 0;
    let ret = json;
    let exists: boolean = true;
    while (i < l && exists) {
      if (ret.hasOwnProperty(parts[i])) {
        ret = ret[parts[i]];
      } else {
        exists = false;
      }
      i++;
    }
    if (exists) {
      return ret;
    } else {
      return null;
    }
  }

}
