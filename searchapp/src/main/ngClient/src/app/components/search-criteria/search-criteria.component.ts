import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

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
    { field: '_text_', label: 'kdekoliv' },
    { field: 'title', label: 'název' },
    { field: 'autor', label: 'autor' },
    { field: 'keywords', label: 'klíčová slova' },
    { field: 'ocr', label: 'plný text dokumentu' }
  ]

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.criteria.push(new Criterium());
    this.route.params
      .switchMap((params: Params) => Observable.of(params['criteria'])).subscribe(criteria => {
        console.log('criteria');
        if (criteria) {
          this.criteria = [];
          let j = JSON.parse(criteria);
          for (let i in j) {
            let c: Criterium = new Criterium();
            Object.assign(c, j[i]);
            this.criteria.push(c);
          }
          this.onSearch.emit(this.criteria);
        }
      });
  }
  
  setField(criterium: Criterium, field: string){
    criterium.field = field;
  }
  
  getLabel(criterium: Criterium): string{
    for(let i in this.fields){
      if (criterium.field === this.fields[i].field){
        return this.fields[i].label;
      }
    }
    return 'kdekoliv';
    
  }


  addCriterium() {
    this.criteria.push(new Criterium());
  }

  search() {
    this.router.navigate(['/hledat', {criteria: JSON.stringify(this.criteria), start: 0}])
    //this.onSearch.emit(this.criteria);
  }

}
