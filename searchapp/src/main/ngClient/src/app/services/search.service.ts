import { Injectable, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Jsonp, Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '../app.state';


@Injectable()
export class SearchService {

  constructor(
    private state: AppState,
    private http: Http,
    private jsonp: Jsonp,
    private translate: TranslateService) { }

  

}
