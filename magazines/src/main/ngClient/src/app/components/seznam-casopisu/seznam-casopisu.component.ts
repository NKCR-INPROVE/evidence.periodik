import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {AppState} from '../../app.state';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-seznam-casopisu',
  templateUrl: './seznam-casopisu.component.html',
  styleUrls: ['./seznam-casopisu.component.scss']
})
export class SeznamCasopisuComponent implements OnInit {
  

  subscriptions: Subscription[] = [];

  constructor(public state: AppState, private service: AppService) {
    this.subscriptions.push(this.state.paramsSubject.subscribe((state) => {
      this.service.getIssues().subscribe(res => {});
    }));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
  }

}
