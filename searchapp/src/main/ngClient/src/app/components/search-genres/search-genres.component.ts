import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SearchService } from '../../services/search.service';
import { Criterium } from '../../models/criterium';

@Component({
  selector: 'app-search-genres',
  templateUrl: './search-genres.component.html',
  styleUrls: ['./search-genres.component.scss']
})
export class SearchGenresComponent implements OnInit {
  
  genres: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService) { }

  ngOnInit() {
    this.getGenres();
  }
  
  getGenres(){
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
      
//      let gs = res['facet_counts']['facet_fields']['genre'];
//      for(let i in gs){
//        if(gs[i][0] !== ''){
//          this.genres.push(gs[i]);
//        }
//      }

    });
  }
  
  search(genre: string){
    let c = new Criterium();
    c.field = 'genre';
    c.value = genre;
    this.router.navigate(['/hledat/cokoli', {criteria: JSON.stringify([c]), start: 0}])
  }

}
