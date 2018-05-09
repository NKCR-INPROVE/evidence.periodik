import {Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';

import {Criterium} from '../../models/criterium';
import {AppState} from '../../app.state';
import {AppService} from '../../services/app.service';

@Component({
    selector: 'app-search-criteria',
    templateUrl: './search-criteria.component.html',
    styleUrls: ['./search-criteria.component.scss']
})
export class SearchCriteriaComponent implements OnInit, OnDestroy {

    @ViewChild('lupa') lupa: ElementRef;
    @Output() onSearch: EventEmitter<Criterium[]> = new EventEmitter<Criterium[]>();
    subscriptions: Subscription[] = [];

    criteria: Criterium[] = [];
    fields = [
        {field: '_text_', label: 'kdekoliv'},
        {field: 'title', label: 'název'},
        {field: 'autor', label: 'autor'},
        {field: 'keywords', label: 'klíčová slova'},
        {field: 'genre', label: 'rubrika'},
        {field: 'ocr', label: 'plný text dokumentu'}
    ]

    operators = [
        {val: 'AND', label: 'a zároveň'},
        {val: 'OR', label: 'nebo'}
    ]

    constructor(
        private state: AppState,
        private service: AppService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.criteria.push(new Criterium());
        this.route.params
            .switchMap((params: Params) => Observable.of(params['criteria'])).subscribe(criteria => {
                if (criteria) {
                    this.criteria = [];
                    let j = JSON.parse(criteria);
                    for (let i in j) {
                        let c: Criterium = new Criterium();

                        Object.assign(c, j[i]);

                        this.criteria.push(c);
                    }

                    //this.onSearch.emit(this.criteria);
                    if (this.state.config) {
                        this.service.searchFired(this.criteria);
                    } else {

                        this.subscriptions.push(this.state.configSubject.subscribe(
                            () => {
                                this.service.searchFired(this.criteria);
                            }
                        ));
                    }
                }
            });
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s: Subscription) => {
            s.unsubscribe();
        });
        this.subscriptions = [];
    }

    setField(criterium: Criterium, field: string) {
        criterium.field = field;
    }

    getLabel(criterium: Criterium): string {
        for (let i in this.fields) {
            if (criterium.field === this.fields[i].field) {
                return this.fields[i].label;
            }
        }

        return 'kdekoliv';
    }

    setOperator(criterium: Criterium, val: string) {
        criterium.operator = val;
    }

    getOperator(criterium: Criterium): string {
        for (let i in this.operators) {
            if (criterium.operator === this.operators[i].val) {
                return this.operators[i].label;
            }
        }
        return 'a zároveň';

    }

    addCriterium() {
        this.criteria.push(new Criterium());
    }

    removeCriterium(i: number) {
        this.criteria.splice(i, 1);
        this.search();
    }

    reset() {
        this.criteria = [];
        this.state.resetDates();
        this.criteria.push(new Criterium());
        this.search();
    }

    search() {
        let p = {};
        Object.assign(p, this.route.snapshot.params);
        p['criteria'] = JSON.stringify(this.criteria);
        p['date'] = JSON.stringify(this.state.dateRange);
        p['start'] = 0;
        this.lupa.nativeElement.blur();
        this.router.navigate([p], { relativeTo: this.route });
    }

}
