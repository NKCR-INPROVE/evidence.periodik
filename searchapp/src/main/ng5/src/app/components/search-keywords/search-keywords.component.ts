import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { SearchService } from '../../services/search.service';
import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';
import { Criterium } from '../../models/criterium';

import Utils from '../../services/utils';

@Component({
  selector: 'app-search-keywords',
  templateUrl: './search-keywords.component.html',
  styleUrls: ['./search-keywords.component.scss']
})
export class SearchKeywordsComponent implements OnInit, OnDestroy {


  subscriptions: Subscription[] = [];

  public keywordsFiltered: any[] = [];
  public keywords1: any[];
  public keywords2: any[];

  public qkeyword: string;

  rowsPerCol: number = 10;
  letter: string = null;
  page: number = 0;
  totalPages: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private service: AppService,
    public state: AppState) { }

  ngOnInit() {
    this.getKeywords();
    this.subscriptions.push(this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (this.route.snapshot.params.hasOwnProperty('letter')) {
          this.setLetter(this.route.snapshot.params['letter']);
        } else {
          this.setLetter(null);
        }
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
  }


  getKeywords() {
    if (this.state.config) {
        this.filter();
    } else {

      this.subscriptions.push(this.state.stateChangedSubject.subscribe(
        () => {
          this.filter();
        }
      ));
    }
  }

  setLetter(l: string) {
    this.page = 0;
    this.letter = l;
    this.filter();
    if (l !== null) {
      this.router.navigate([{ letter: l }], { relativeTo: this.route });
    }
  }

  setPage(p: number) {
    this.page = p;
    this.setCols();
  }

  isEmpty(l: string) {
    if (this.state.keywords.length === 0) {
      return true;
    }
    let has = false;
    this.state.keywords.forEach((el) => {
      let k: string = el.val[0];
      if (k.toLocaleLowerCase().charAt(0) === l.toLocaleLowerCase()) {
        has = true;
        return;
      }
    });
    return !has;
  }

  isEmptyNumbers() {
    if (this.state.keywords.length === 0) {
      return true;
    }
    let has = false;
    this.state.keywords.forEach((el) => {
      let k: string = el.val[0];
      if (Number.isInteger(parseInt(k.toLocaleLowerCase().charAt(0)))) {
        has = true;
        return;
      }
    });
    return !has;
  }

  filter() {
    this.keywordsFiltered = [];
    if (this.letter !== null) {

      this.state.keywords.forEach((el) => {
        let k: string = el.val;
        let first: string = k.toLocaleLowerCase().charAt(0);
        if(this.letter === '0-9'){
          if (Number.isInteger(parseInt(first))) {
            this.keywordsFiltered.push(el);
          }
        }else{
          if (Utils.removeDiacritics(first) === this.letter.toLocaleLowerCase()) {
            this.keywordsFiltered.push(el);
          }
        }
      });
    } else {
      this.keywordsFiltered = this.state.keywords;
    }
    this.totalPages = Math.ceil(this.keywordsFiltered.length / (this.rowsPerCol * 2));
    this.setCols();
  }

  setCols() {
    this.keywords1 = [];
    this.keywords2 = [];
    let min: number = this.page * this.rowsPerCol * 2;
    let max: number = Math.min(min + this.rowsPerCol, this.keywordsFiltered.length);
    for (let i = min; i < max; i++) {
      this.keywords1.push(this.keywordsFiltered[i]);
    }
    //min = (this.page + 1) * this.rowsPerCol * 2;
    min = max;
    max = Math.min(min + this.rowsPerCol, this.keywordsFiltered.length);
    for (let i = min; i < max; i++) {
      this.keywords2.push(this.keywordsFiltered[i]);
    }
  }

  search(s: string) {
      this.state.resetDates();
    let c = new Criterium();
    c.field = 'keywords';
    c.value = '"' + s + '"';
    this.router.navigate(['/hledat/cokoliv', { criteria: JSON.stringify([c]), start: 0 }])
  }

  searchInput() {
    this.search(this.qkeyword);
  }

}
