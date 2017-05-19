import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import {  URLSearchParams } from '@angular/http';

import { Criterium } from '../../models/criterium';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  
  @ViewChild('results') results: ElementRef; 
  docs: any[];
  numFound : number;
  
  start: number;
  rowsSelect: number[] = [10, 20, 30];
  rows: number = 10;
  
  dateRange: number[] = [1, 5];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => Observable.of(params['start'])).subscribe(start => {
        console.log('start: ' + start);
        this.start = +start;
      });
  }
  prevPage(){
    this.start = Math.max(0, this.start - this.rows);
    this.setPage();
  }
  nextPage(){
    this.start += this.rows;
    this.setPage();
  }
  
  setPage(){
    let p = {};
    Object.assign(p, this.route.snapshot.params);
    console.log(p)
    p['start'] = this.start;
    this.router.navigate([p], { relativeTo: this.route });
  }
  
  setRows(r: number){
    this.rows = r;
    let p = {};
    Object.assign(p, this.route.snapshot.params);
    console.log(p)
    p['rows'] = this.rows;
    this.router.navigate([p], { relativeTo: this.route });
  }
  
  search(criteria: Criterium[]){
    this.numFound = 0;

    var params = new URLSearchParams();
    params.set('q', '*:*');
    params.set('fq', 'model:article');
    params.set('start', this.start+'');
    params.set('rows', this.rows+'');
    for(let i in criteria){
      if(criteria[i].field){
        params.append('fq', criteria[i].field + ':' + criteria[i].value);
      } else {
        params.append('fq', criteria[i].value);
      }
    }
    
    this.searchService.search(params).subscribe(res => {
      console.log(this.results);
      console.log(this.results.nativeElement.offsetTop);
      this.docs = res['response']['docs'];
      this.numFound = res['response']['numFound'];
      this.results.nativeElement.scrollIntoView();
      //document.getElementsByTagName('body')[0].scrollTop = this.results.nativeElement.offsetTop;
    });
  }

}
