import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { SearchService } from '../../services/search.service';
import { Criterium } from '../../models/criterium';

@Component({
  selector: 'app-search-keywords',
  templateUrl: './search-keywords.component.html',
  styleUrls: ['./search-keywords.component.scss']
})
export class SearchKeywordsComponent implements OnInit {
  
  public keywords: any[];
  public keywordsFiltered: any[];
  public keywords1: any[];
  public keywords2: any[];
  
  rowsPerCol : number = 10;
  letter: string = null;
  page: number = 0;
  pages: [1,2,3,4,5];
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService) { }

  ngOnInit() {
    this.getKeywords();
  }
  
  getKeywords(){
    var params = new URLSearchParams();
    params.set('q', '*:*');
    params.set('fq', '-genre:""');
    params.set('rows', '0');
    //Rok jako stats
    params.set('facet', 'true');
    params.set('facet.field', 'keywords');
    params.set('facet.mincount', '1');
    params.set('facet.sort', 'index');
    this.searchService.search(params).subscribe(res => {
      
      this.keywords = res['facet_counts']['facet_fields']['keywords'];
      this.filter();

    });
  }
  
  setLetter(l: string){
    this.letter = l;
    this.filter();
  }
  
  setPage(p: number){
    this.page = p;
    this.setCols();
  }
  
  filter(){
    this.keywordsFiltered = [];
    if(this.letter !== null){

      this.keywords.forEach((el) =>{
//        console.log(el);
        let k : string = el[0];
        if (k.toLowerCase().charAt(0) === this.letter){
          this.keywordsFiltered.push(el);
        }
      });
    } else {
      this.keywordsFiltered = this.keywords;
    }
    this.setCols();
  }
  
  setCols(){
    this.keywords1 = [];
    this.keywords2 = [];
    for (let i = 0; i < this.rowsPerCol; i++){
      this.keywords1.push(this.keywordsFiltered[i + (this.rowsPerCol * this.page)]);
      this.keywords2.push(this.keywordsFiltered[i+ (this.rowsPerCol * this.page) + this.rowsPerCol]);
    }
  }
  
  search(s: string){
    let c = new Criterium();
    c.field = 'keywords';
    c.value = s;
    this.router.navigate(['/hledat/cokoli', {criteria: JSON.stringify([c]), start: 0}])
  }
}
