import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {AppState} from '../../app.state';
import { AppService } from '../../app.service';


@Component({
  selector: 'app-vydavatele',
  templateUrl: './vydavatele.component.html',
  styleUrls: ['./vydavatele.component.scss']
})
export class VydavateleComponent implements OnInit {

  subscriptions: Subscription[] = [];

  constructor(public state: AppState, private service: AppService) {
    this.subscriptions.push(this.state.paramsSubject.subscribe((state) => {
      this.service.getEditors().subscribe(res => {});
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
