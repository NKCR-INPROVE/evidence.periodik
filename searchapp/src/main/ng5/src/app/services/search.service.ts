import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { AppState } from '../app.state';


import {SearchResult} from '../models/search-result.model';
import {CurrentSearch} from '../models/current-search.model';
import {Journal} from '../models/journal.model';


@Injectable()
export class SearchService {

    
  constructor(
    private state: AppState,
    private http: HttpClient) { }

  search(params : HttpParams) {
    let p = params.append('fq', 'root_pid:"' + this.state.config['journal'] + '"');
    var url = this.state.config['context'] + 'search/journal/select';    
    return this.http.get(url, { params: p });
  }


}
