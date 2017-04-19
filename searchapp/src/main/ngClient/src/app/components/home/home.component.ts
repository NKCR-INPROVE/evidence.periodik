import { Component, OnInit } from '@angular/core';

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
  genres : string[] = [];
  genresObject = {};

  constructor(
    private service: AppService,
    private state: AppState
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
      this.genres  = [];
      this.genresObject = {};
      this.actual = this.state.actualNumber;
      this.img = this.state.imgSrc;
      this.service.getArticles(this.actual.pid).subscribe(res => {
        for(let i in res){
          let art = res[i];
          this.service.getMods(art['pid']).subscribe(bmods => {
            art['mods'] = bmods;
            let mods = bmods["mods:modsCollection"]["mods:mods"];
            let genre = this.service.getJsonValue(mods, "mods:genre");
            if(genre.hasOwnProperty('@type')){
              art['genre'] = genre['@type'];
            } else if(genre.hasOwnProperty('length')){
              for(let i in genre){
                art['genre'] = genre[i]['@type'];
              }
            }
            if(this.isVisible(art['genre'])){
              if (this.genresObject.hasOwnProperty(art['genre'])){
                this.genresObject[art['genre']]['articles'].push(art);
              } else  {
                this.genres.push(art['genre']);
                this.genresObject[art['genre']] = {};
                this.genresObject[art['genre']]['articles'] = [];
                this.genresObject[art['genre']]['articles'].push(art);
              }
            }
//            if (this.service.getJsonValue(mods, "mods:genre") !== null){
//            }
          });
        }
      });
      //this.img = 'img/item/' + this.state.actualNumber.pid + '/thumb';
    }
  }
  
  isVisible(genre: string): boolean{
    return genre !== 'cover' &&
      genre !== 'advertisement' &&
      genre !== 'colophon';
  }

}
