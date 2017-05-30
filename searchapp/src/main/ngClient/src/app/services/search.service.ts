import { Injectable, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

import {  Http, Response, URLSearchParams } from '@angular/http';

import { AppState } from '../app.state';


import {SearchResult} from '../models/search-result.model';
import {CurrentSearch} from '../models/current-search.model';
import {Journal} from '../models/journal.model';


@Injectable()
export class SearchService {


  searchResults: BehaviorSubject<SearchResult[]> = new BehaviorSubject<SearchResult[]>([]);
  actualNumber: BehaviorSubject<Journal> = new BehaviorSubject<Journal>(new Journal());
    
  constructor(
    private state: AppState,
    private http: Http) { }

  search(params : URLSearchParams) {

    var url = this.state.config['context'] + 'search/journal/select';

    
    return this.http.get(url, { search: params }).map(res => {
      return res.json();
    });
  }


}
