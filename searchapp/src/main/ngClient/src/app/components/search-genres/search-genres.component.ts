import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AppState } from '../../app.state';
import { SearchService } from '../../services/search.service';
import { Criterium } from '../../models/criterium';

@Component({
  selector: 'app-search-genres',
  templateUrl: './search-genres.component.html',
  styleUrls: ['./search-genres.component.scss']
})
export class SearchGenresComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  
  genres: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    public state: AppState) { }

  ngOnInit() {
    this.getGenres();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
  }
  
  getGenres(){
    if (this.state.config) {
    var params = new URLSearchParams();
    params.set('q', '*:*');
    params.set('fq', '-genre:""');
    params.set('rows', '0');
    //Rok jako stats
    params.set('facet', 'true');
    params.set('facet.field', 'genre');
    params.set('facet.mincount', '1');
    params.set('facet.sort', 'index');
    this.searchService.search(params).subscribe(res => {
      
      this.genres = res['facet_counts']['facet_fields']['genre'];

    });
    } else {

      this.subscriptions.push(this.state.stateChangedSubject.subscribe(
        () => {
          this.getGenres();
        }
      ));
    }
  }
  
  search(genre: string){
    let c = new Criterium();
    c.field = 'genre';
    c.value = '"' + genre + '"';;
    this.router.navigate(['/hledat/cokoliv', {criteria: JSON.stringify([c]), start: 0}])
  }

}
