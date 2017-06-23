import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../services/app.service';
import { Journal } from '../../models/journal.model';
import { AppState } from '../../app.state';

@Component({
  selector: 'app-actual',
  templateUrl: './actual.component.html',
  styleUrls: ['./actual.component.scss']
})
export class ActualComponent implements OnInit {
  
  img: string = '';
  actual: Journal;
  krameriusLink: string;
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
      this.krameriusLink = this.state.config['k5'] + this.state.config['journal'];
      //this.img = 'img/item/' + this.state.actualNumber.pid + '/thumb';
    }
  }
  
  gotoArchiv(pid: string){
    this.router.navigate(['archiv/', pid])
  }

  isHiddenByGenre(genres: string[]) {
    //console.log(this.state.config['hiddenGenres'], genres);
    for (let g in genres) {
      //console.log(g);
      if (this.state.config['hiddenGenres'].indexOf(genres[g]) > -1) {
        return true;
      }
    }
    return false;
  }
  

}
