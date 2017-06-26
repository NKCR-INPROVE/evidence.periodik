import { Component, OnInit } from '@angular/core';

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
export class AdminComponent implements OnInit {

  menu: any = [{ label: 'home', menu: [{ route: "home", visible: true }, { "route": "news", "visible": true }] }];
  selected: string = 'home';
  
  text: string;

  constructor(
    public state: AppState,
    private service: AppService) { }

  ngOnInit() {

    this.state.configSubject.subscribe(val => {
      for (let m in this.state.config['menu']) {
        this.menu.push({ label: m, menu: this.state.config['menu'][m] })
      }
      console.log(this.menu);
    });
  }

  select(m1: menuItem) {
    this.service.getText(m1.route).subscribe(t => this.text = t);
    this.selected = m1.route;
  }
  
  save(){
    this.service.saveText(this.selected, this.text).subscribe(res =>{
      console.log(res);
    });
  }

}
