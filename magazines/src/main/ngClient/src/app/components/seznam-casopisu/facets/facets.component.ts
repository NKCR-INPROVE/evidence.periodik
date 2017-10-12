import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {AppState} from '../../../app.state';
import {AppService} from '../../../app.service';

@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.scss']
})
export class FacetsComponent implements OnInit {
  
  subscriptions: Subscription[] = [];
  active : boolean = false;
  
  constructor(public state: AppState, private service: AppService) {
    
  }

  ngOnInit() {
    this.active = this.state.facets.length > 0;
    this.subscriptions.push(this.state.stateChangedSubject.subscribe((st) => {
      setTimeout(() => {
        this.active = true;
      }, 100);
      
    }));
    
  }

  ngOnDestroy() {
    this.active = false;
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
  }
  
  addFilter(field: string, value: string){
    if (!this.state.isFacetUsed(field, value)){
      this.state.addFilter(field, value);
      this.service.getMagazines().subscribe();
    }
  }

}
