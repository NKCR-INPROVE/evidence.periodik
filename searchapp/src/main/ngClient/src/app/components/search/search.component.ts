import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Router, ActivatedRoute, Params, NavigationStart, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { NouisliderComponent } from 'ng2-nouislider';

import { URLSearchParams } from '@angular/http';

import { Criterium } from '../../models/criterium';
import { SearchService } from '../../services/search.service';

import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  @ViewChild('results') results: ElementRef;
  @ViewChild('dateSlider') public dateSlider: NouisliderComponent;
  docs: any[];
  numFound: number;
  totalPages: number = 0;

  start: number = 0;
  rowsSelect: number[] = [10, 20, 30];
  rows: number = 10;
  dateMin: number = 0;
  dateMax: number = 1;
  dateOd: number = 0;
  dateDo: number = 1;
  dateRange: number[] = [0, 1];

  public dateForm: FormGroup;

  subscriptions: Subscription[] = [];

  constructor(
    private service: AppService,
    private state: AppState,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.subscriptions.push(this.service.searchSubject.subscribe((criteria: Criterium[]) => this.search(criteria)));

    this.getStats();
    this.subscriptions.push(this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (this.route.snapshot.firstChild.params.hasOwnProperty('start')) {
          this.start = +this.route.snapshot.firstChild.params['start'];
        }
        if (this.route.snapshot.firstChild.params.hasOwnProperty('rows')) {
          this.rows = +this.route.snapshot.firstChild.params['rows'];
        }
      } else if (val instanceof NavigationStart) {

      }
    }));
    this.subscriptions.push(this.route.params
      .switchMap((params: Params) => Observable.of(params['start'])).subscribe(start => {
        if (start) {
          this.start = +start;
        }
      }));

    this.subscriptions.push(this.route.params
      .switchMap((params: Params) => Observable.of(params['date'])).subscribe(date => {
        if (date) {
          let j = JSON.parse(date);
          this.changeRangeFormValue(j[0], j[1]);
        }
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
  }

  showResults() {
    let s = this.route.snapshot.children[0].url[0].path;
    return s.indexOf('cokoliv') > -1;
  }

  lastResult() {
    return Math.min(this.start + this.rows + 1, this.numFound);
  }

  search(criteria: Criterium[]) {
    this.numFound = 0;

    var params = new URLSearchParams();
    params.set('q', '*:*');
    params.set('fq', 'model:article');
    params.set('start', this.start + '');
    params.set('rows', this.rows + '');
    if (criteria.length > 0) {
      let fq = '';
      for (let i = 0; i < criteria.length; i++) {
        if (i > 0) {
          fq += criteria[i].operator + ' ';
        }
        if (criteria[i].field) {
          fq += criteria[i].field + ':' + criteria[i].value + ' ';
        } else {
          fq += criteria[i].value + ' ';
        }
      }
      params.append('fq', fq.trim());
    }

    //Add date filter
    if(this.dateForm){
      params.append('fq', 'year:[' + this.dateForm.controls['range'].value[0] + ' TO ' + this.dateForm.controls['range'].value[1] + ']');
    }

    //console.log(params.toString());

    //Rok jako stats
    params.set('stats', 'true');
    params.set('stats.field', 'year');

    this.searchService.search(params).subscribe(res => {

      this.docs = res['response']['docs'];
      this.numFound = res['response']['numFound'];
      this.totalPages = Math.floor(this.numFound / this.rows);

      if (this.numFound == 0) {
        this.changeRangeFormValue(this.dateMin, this.dateMax);
      } else if (res.hasOwnProperty('stats') && res['stats']['stats_fields'].hasOwnProperty('year')) {
        this.changeRangeFormValue(res['stats']['stats_fields']['year']['min'], res['stats']['stats_fields']['year']['max']);
      }

      //this.results.nativeElement.scrollIntoView();

    });
  }

  getStats() {
    if (this.state.config) {
      this.dateMin = 2000;
      this.dateMax = 2017;
      this.dateForm = this.formBuilder.group({ 'range': [[this.dateMin, this.dateMax]] });

      var params = new URLSearchParams();
      params.set('q', '*:*');
      params.set('rows', '0');
      //Rok jako stats
      params.set('stats', 'true');
      params.set('stats.field', 'year');

      this.searchService.search(params).subscribe(res => {
        if (res.hasOwnProperty('stats') && res['stats']['stats_fields'].hasOwnProperty('year')) {
          this.dateMin = res['stats']['stats_fields']['year']['min'];
          this.dateMax = res['stats']['stats_fields']['year']['max'];
          this.dateForm = this.formBuilder.group({ 'range': [[this.dateMin, this.dateMax]] });

        }

      });
    } else {
      this.subscriptions.push(this.state.stateChangedSubject.subscribe(
        () => {
          this.getStats();
        }
      ));
    }
  }

  changeRangeFormValue(dateOd: number, dateDo: number) {
    const control = <FormControl>this.dateForm.controls['range'];
    const newRange = control.value;
    newRange[0] = dateOd;
    newRange[1] = dateDo;
    control.setValue(newRange);
  }

  onDateChange(e) {
    let p = {};
    Object.assign(p, this.route.snapshot.firstChild.params);
    p['date'] = JSON.stringify(this.dateForm.controls['range'].value);
    this.router.navigate(['/hledat/cokoliv', p]);
    return;
  }


  setPage(page: number) {
    this.start = page * this.rows;
    let p = {};
    Object.assign(p, this.route.snapshot.firstChild.params);
    console.log(p)
    p['start'] = this.start;
    this.router.navigate(['/hledat/cokoliv', p]);
  }

  setRows(r: number) {
    this.rows = r;
    let p = {};
    Object.assign(p, this.route.snapshot.firstChild.params);
    p['rows'] = this.rows;
    this.router.navigate(['/hledat/cokoliv', p]);
  }


}
