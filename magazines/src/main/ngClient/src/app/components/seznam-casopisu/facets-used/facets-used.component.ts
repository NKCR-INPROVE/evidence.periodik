import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {AppState} from '../../../app.state';
import {AppService} from '../../../app.service';


@Component({
  selector: 'app-facets-used',
  templateUrl: './facets-used.component.html',
  styleUrls: ['./facets-used.component.scss']
})
export class FacetsUsedComponent implements OnInit {
  
  subscriptions: Subscription[] = [];

  constructor(public state: AppState, private service: AppService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
  }
  
  removeFilter(idx: number){
    this.state.removeFilter(idx);
    this.service.getMagazines().subscribe();
  }
  
  removeAllFilters(){
    this.state.filters = [];
    this.service.getMagazines().subscribe();
  }

}
