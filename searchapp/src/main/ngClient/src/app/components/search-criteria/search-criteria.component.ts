import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Criterium } from '../../models/criterium';

@Component({
  selector: 'app-search-criteria',
  templateUrl: './search-criteria.component.html',
  styleUrls: ['./search-criteria.component.scss']
})
export class SearchCriteriaComponent implements OnInit {
  
  //@Input() criterium: Criterium;
  @Output() onSearch: EventEmitter<Criterium[]> = new EventEmitter<Criterium[]>();
  
  criteria: Criterium[] = [];
  fields = [
    {field: 'full', label: 'kdekoliv'},
    {field: 'title', label: 'název'},
    {field: 'autor', label: 'autor'},
    {field: 'keywords', label: 'klíčová slova'},
    {field: 'ocr', label: 'plný text dokumentu'}
    ]

  constructor() { }

  ngOnInit() {
    this.criteria.push(new Criterium());
  }
  
  
  addCriterium(){
    this.criteria.push(new Criterium());
  }
  
  search(){
    this.onSearch.emit(this.criteria);
  }

}
