import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { SearchService } from '../../services/search.service';
import { AppState } from '../../app.state';
import { Criterium } from '../../models/criterium';

@Component({
  selector: 'app-search-authors',
  templateUrl: './search-authors.component.html',
  styleUrls: ['./search-authors.component.scss']
})
export class SearchAuthorsComponent implements OnInit, OnDestroy {


  subscriptions: Subscription[] = [];

  loaded: boolean = false;
  public authors: any[] = [];
  public authorsFiltered: any[] = [];
  public authors1: any[];
  public authors2: any[];

  public qautor: string;

  rowsPerCol: number = 10;
  letter: string = null;
  page: number = 0;
  totalPages: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    public state: AppState) { }

  ngOnInit() {
    this.getAuthors();
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


  getAuthors() {
    if (this.state.config) {
      var params = new URLSearchParams();
      params.set('q', '*:*');
      params.set('rows', '0');
      //Rok jako stats
      params.set('facet', 'true');
      params.set('facet.field', 'autor_facet');
      params.set('facet.mincount', '1');
      params.set('facet.limit', '-1');
      params.set('facet.sort', 'index');
      this.loaded = false;
      this.searchService.search(params).subscribe(res => {
        this.authors = [];
        for (let i in res['facet_counts']['facet_fields']['autor_facet']) {
//          this.authors.push(res['facet_counts']['facet_fields']['autor_facet'][i][0]);
          
          
          let val: string = res['facet_counts']['facet_fields']['autor_facet'][i][0];
          if(val && val !== ''){
            let val_lower: string = val.toLocaleLowerCase(); 
            this.authors.push({val: val, val_lower: val_lower});
          }
          
          
        }
        
        this.authors.sort((a, b) => {
          return a.val_lower.localeCompare(b.val_lower, 'cs');
        });
        
        this.filter();
        this.loaded = true;

      });
    } else {

      this.subscriptions.push(this.state.configSubject.subscribe(
        () => {
          this.getAuthors();
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
    if (this.authors.length === 0) {
      return true;
    }
    let has = false;
    this.authors.forEach((el) => {
      let k: string = el.val[0];
      if (k.toLocaleLowerCase().charAt(0) === l.toLocaleLowerCase()) {
        has = true;
        return;
      }
    });
    return !has;
  }

  filter() {
    this.authorsFiltered = [];
    if (this.letter !== null) {

      this.authors.forEach((el) => {
        //        console.log(el);
        let k: string = el.val;
        if (k.toLocaleLowerCase().charAt(0) === this.letter.toLocaleLowerCase()) {
          this.authorsFiltered.push(el);
        }
      });
    } else {
      this.authorsFiltered = this.authors;
    }
    this.totalPages = Math.ceil(this.authorsFiltered.length / (this.rowsPerCol * 2));
    this.setCols();
  }

  setCols() {
    this.authors1 = [];
    this.authors2 = [];
    let min: number = this.page * this.rowsPerCol * 2;
    let max: number = Math.min(min + this.rowsPerCol, this.authorsFiltered.length);
    for (let i = min; i < max; i++) {
      this.authors1.push(this.authorsFiltered[i]);
    }
    min = max;
    max = Math.min(min + this.rowsPerCol, this.authorsFiltered.length);
    for (let i = min; i < max; i++) {
      this.authors2.push(this.authorsFiltered[i]);
    }
  }

  search(s: string) {
      this.state.resetDates();
    let c = new Criterium();
    c.field = 'autor';
    c.value = '"' + s + '"~3';
    this.router.navigate(['/hledat/cokoliv', { criteria: JSON.stringify([c]), start: 0 }])
  }

  searchInput() {
    this.search(this.qautor);
  }

}
