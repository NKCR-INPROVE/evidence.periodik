import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Criterium } from '../../models/criterium';

@Component({
  selector: 'app-search-authors',
  templateUrl: './search-authors.component.html',
  styleUrls: ['./search-authors.component.scss']
})
export class SearchAuthorsComponent implements OnInit {

  //@Input() criterium: Criterium;
  @Output() onSearch: EventEmitter<Criterium[]> = new EventEmitter<Criterium[]>();

  constructor() { }

  ngOnInit() {
  }

}
