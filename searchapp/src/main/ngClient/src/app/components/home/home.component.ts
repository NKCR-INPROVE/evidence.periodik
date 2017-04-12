import { Component, OnInit } from '@angular/core';

import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { AppService } from '../../services/app.service';
import { SearchService } from '../../services/search.service';
import { AppState } from '../../app.state';
import { ActualNumber } from '../../models/actual-number.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //private state: ActualNumber;
  //actualNumber: Observable<ActualNumber>;
  
  
  img: string = '';
  details;

  constructor(
    //private store: Store<ActualNumber>,
    private state: AppState,
    private appService: AppService,
    private searchService: SearchService
  ) {

    //this.actualNumber = this.store.select<ActualNumber>('actual');
  }

  ngOnInit() {
    this.setData();

    this.state.stateChangedSubject.subscribe(
      () => {
        this.setData();
      }
    );
    //this.searchService.actualNumber.subscribe((a: ActualNumber) => this.actualNumber = a);
    
    //    this.actualNumber.subscribe((state: ActualNumber) => {
    //      this.state = state;
    //      this.searchService.getActual();
    //    });
  }

  setData() {
    if (this.state.actualNumber) {
      this.details = this.state.actualNumber.details;
      this.img = this.state.imgSrc;
      //this.img = 'img/item/' + this.state.actualNumber.pid + '/thumb';
    }
  }

}
