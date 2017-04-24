import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../services/app.service';

import { Journal } from '../../models/journal.model';

import { AppState } from '../../app.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  img: string = '';
  actual: Journal;
  //articles: any[] = [];

  constructor(
    private service: AppService,
    private state: AppState,
    private router: Router
  ) {

    //this.actualNumber = this.store.select<Journal>('actual');
  }

  ngOnInit() {
    this.setData();

    this.state.stateChangedSubject.subscribe(
      () => {
        this.setData();
      }
    );
  }

  setData() {
    if (this.state.actualNumber) {
      this.actual = this.state.actualNumber;
      this.img = this.state.imgSrc;
      //this.img = 'img/item/' + this.state.actualNumber.pid + '/thumb';
    }
  }
  
  gotoArchiv(pid: string){
    this.router.navigate(['archiv/', pid])
  }
  

}
