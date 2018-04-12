import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../../app.state';

import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-free-text',
  templateUrl: './free-text.component.html',
  styleUrls: ['./free-text.component.scss']
})
export class FreeTextComponent implements OnInit, OnDestroy {

  @Input() page: string;


  subscriptions: Subscription[] = [];

  text: string;
  id: string;
  img: string = '';

  constructor(private state: AppState,
    private appService: AppService,
    private router: Router) { }

  ngOnInit() {
    this.subscriptions.push(this.appService.langSubject.subscribe(
      () => {
        this.getText();
      }
    ));

    if (!this.page) {
      this.subscriptions.push(this.router.events.subscribe(val => {
        if (val instanceof NavigationEnd) {
          this.id = val.url.substring(1);
          if (this.state.currentLang) {
            this.getText();
          }
        }
      }));
    } else {
      this.id = this.page;
      this.getText();
    }

  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
  }

  getText() {
    this.appService.getText(this.id).subscribe(t => this.text = t);
  }

}
