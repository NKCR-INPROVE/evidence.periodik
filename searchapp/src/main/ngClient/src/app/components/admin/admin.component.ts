import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';

interface menuItem {
  route: string;
  visible: boolean;
};

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  menu: any[] = [];
  selected: string = 'home';
  visibleChanged: boolean = false;

  text: string;

  constructor(
    public state: AppState,
    private service: AppService) { }

  ngOnInit() {

    if (this.state.config) {
      this.fillMenu();
    } else {
      this.subscriptions.push(this.state.configSubject.subscribe(val => {
        this.fillMenu();
      }));
    }

    this.subscriptions.push(this.service.langSubject.subscribe(val => {
      this.service.getText(this.selected).subscribe(t => this.text = t);
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
  }

  fillMenu() {
    for (let m in this.state.config['menu']) {
      this.menu.push({ label: m, menu: this.state.config['menu'][m] })
    }

    this.service.getText(this.selected).subscribe(t => this.text = t);
  }

  select(m: string, m1: string) {
    if (m1) {
      this.selected = m + '/' + m1;
    } else {
      this.selected = m;
    }
    this.service.getText(this.selected).subscribe(t => this.text = t);
  }

  save() {
    let menuToSave = null;
    if (this.visibleChanged) {
      menuToSave = {};
      for (let i = 0; i < this.menu.length; i++) {
        menuToSave[this.menu[i].label] = this.menu[i].menu;
      }
    }
    this.service.saveText(this.selected, this.text, JSON.stringify(menuToSave)).subscribe(res => {
      console.log(res);
    });
  }

  changeVisible() {
    this.visibleChanged = true;
    //console.log(this.menu);
  }

}
