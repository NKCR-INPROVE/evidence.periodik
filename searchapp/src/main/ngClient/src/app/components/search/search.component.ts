import { Component, OnInit } from '@angular/core';

import { Criterium } from '../../models/criterium';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  
  docs: any[];
  numFound : number;
  

  constructor(
  private searchService: SearchService
  ) { }

  ngOnInit() {
  }
  
  search(criteria: Criterium[]){
    this.numFound = 0;
    this.searchService.search(criteria[0].value).subscribe(res => {
      this.docs = res['response']['docs'];
      this.numFound = res['response']['numFound'];
    });
  }

}
