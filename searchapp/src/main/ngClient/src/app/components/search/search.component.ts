import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {Router, ActivatedRoute, Params, NavigationStart, NavigationEnd} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';
import {NouisliderComponent} from 'ng2-nouislider';

import {URLSearchParams} from '@angular/http';

import {Criterium} from '../../models/criterium';
import {SearchService} from '../../services/search.service';

import {AppService} from '../../services/app.service';
import {AppState} from '../../app.state';


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
    dateMin: number = 2000;
    dateMax: number = 2019;
    dateOd: number = 2000;
    dateDo: number = 2019;
    dateRange: number[] = [0, 1];
    hasDateFilter: boolean = false;

    currentSort: any;

    onlyPeerReviewed: boolean = false;

    //  public dateForm: FormGroup;

    subscriptions: Subscription[] = [];

    constructor(
        private service: AppService,
        private state: AppState,
        private router: Router,
        private route: ActivatedRoute,
        private searchService: SearchService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {

        this.currentSort = this.state.sorts[0];
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
                if (this.route.snapshot.firstChild.params.hasOwnProperty('sort')) {
                    let s = this.route.snapshot.firstChild.params['sort'];
                    for (let i in this.state.sorts) {
                        //console.log(this.state.sorts[i].field);
                        if (this.state.sorts[i].field === s) {
                            this.currentSort = this.state.sorts[i];
                            break
                        }
                    }
                    //console.log(s, this.currentSort);
                }
                if (this.route.snapshot.firstChild.params.hasOwnProperty('onlyPeerReviewed')) {
                    this.onlyPeerReviewed = this.route.snapshot.firstChild.params['onlyPeerReviewed'] === 'true';
                }

                if (this.route.snapshot.firstChild.params.hasOwnProperty('date')) {
                    let date = this.route.snapshot.firstChild.params['date'];
                    if (date) {

                        this.hasDateFilter =                         true;
//      this.dateForm = this.formBuilder.group({ 'range': [[this.dateMin, this.dateMax]] });

                        let j = JSON.parse(date);
                        this.changeRangeFormValue(j[0], j[1]);
                        if (this.state.config) {
                            this.search([]);
                        } else {
                            let sss = this.state.configSubject.subscribe(() => {
                                this.search([]);
                                sss.unsubscribe();
                            });
                        }

                    }
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
        return Math.min(this.start + this.rows, this.numFound);
    }

    search(criteria: Criterium[]) {
        this.numFound = 0;

        var params = new URLSearchParams();
        params.set('q', '*:*');
        params.set('q.op', 'AND');
        params.set('fq', 'model:article');
        params.set('start', this.start + '');
        params.set('rows', this.rows + '');
        params.set('sort', this.currentSort.field);
        if (criteria.length > 0) {
            let fq = '';
            let op = 'AND';
            for (let i = 0; i < criteria.length; i++) {
                if (criteria[i].value) {
                    if (fq !== '') {
                        fq += criteria[i - 1].operator + ' ';
                    }
                    if (criteria[i].field) {
                        fq += criteria[i].field + ':' + criteria[i].value + ' ';
                    } else {
                        fq += criteria[i].value + ' ';
                    }
                }
            }
            params.append('fq', fq.trim());

            //Rok jako stats
            params.set('stats', 'true');
            params.set('stats.field', 'year');
        }

        //Add date filter
        if (this.dateOd) {
            params.append('fq', 'year:[' + this.dateOd + ' TO ' + this.dateDo + ']');
        }

        //Add onlyPeerReviewed
        if (this.onlyPeerReviewed) {
            params.append('fq', 'genre:"peer-reviewed"')
        }

        //console.log(params.toString());


        this.searchService.search(params).subscribe(res => {
            this.docs = res['response']['docs'];
            this.numFound = res['response']['numFound'];
            this.totalPages = Math.ceil(this.numFound / this.rows);

            if (this.numFound == 0) {
                this.changeRangeFormValue(this.dateMin, this.dateMax);
            } else if (res.hasOwnProperty('stats') && res['stats']['stats_fields'].hasOwnProperty('year')) {
                //this.changeRangeFormValue(res['stats']['stats_fields']['year']['min'], res['stats']['stats_fields']['year']['max']);
            }

            //this.results.nativeElement.scrollIntoView();

        });
    }

    getStats() {
        if (this.state.config) {
            this.dateMin = 2000;
            this.dateMax = 2019;
                              //this.dateForm = this.formBuilder.group({ 'range': [[this.dateMin, this.dateMax]] });

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
                    if (!this.hasDateFilter) {
                        this.dateOd = this.dateMin;
                        this.dateDo = this.dateMax;
                        this.dateRange = [this.dateOd, this.dateDo];
                    }
                    //this.dateForm = this.formBuilder.group({ 'range': [[this.dateMin, this.dateMax]] });

                }

            });
        } else {
            this.subscriptions.push(this.state.configSubject.subscribe(
                () => {
                    this.getStats();
                }
            ));
        }
    }

    changeRangeFormValue(dateOd: number, dateDo: number) {
        //    const control = <FormControl>this.dateForm.controls['range'];
        //    const newRange = control.value;
        //    newRange[0] = dateOd;
        //    newRange[1] = dateDo;
        //    control.setValue(newRange);
        this.dateOd = dateOd;
        this.dateDo = dateDo;
        this.dateRange = [dateOd, dateDo];
    }

    dateChange() {
        this.onDateChange([this.dateOd, this.dateDo]);
    }
    onDateChange(e) {
        if (e) {
            this.changeRangeFormValue(e[0], e[1]);
        }
        let p = {};
        Object.assign(p, this.route.snapshot.firstChild.params);
        //p['date'] = JSON.stringify(this.dateForm.controls['range'].value);
        p['date'] = JSON.stringify(this.dateRange);
        p['start'] = 0;
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

    setSort(s: any) {
        this.currentSort = s;
        let p = {};
        Object.assign(p, this.route.snapshot.firstChild.params);
        p['sort'] = this.currentSort.field;
        this.router.navigate(['/hledat/cokoliv', p]);
    }

    setPeerReviewed() {
        //this.rows = r;
        let p = {};
        Object.assign(p, this.route.snapshot.firstChild.params);
        p['onlyPeerReviewed'] = this.onlyPeerReviewed;
        this.router.navigate(['/hledat/cokoliv', p]);
    }


}
