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
pidActual: string;

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
//        this.findPid();
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
  
  findPid(){
    this.pidActual = null;
    this.findPidById(this.state.config['journal']);
  }
  
  findPidById(pid: string){
    this.service.getChildren(pid).subscribe(res => {
      if(res.length === 0){
        this.pidActual = null;
        console.log('ERROR. Cannot find actual number');
      } else if(res[0]['datanode']){
        this.pidActual = pid;
        this.service.getJournal(pid).subscribe(j => {
          this.actual = j;
        });
      } else {
        this.findPidById(res[0]['pid']);
      }
    });
  }
  
  gotoArchiv(pid: string){
    this.router.navigate(['archiv/', pid])
  }

  isHiddenByGenre(genres: string[]) {
    return this.service.isHiddenByGenre(genres);
  }
  
  gotoArticle(){
    this.findFirstdatanode(this.actual['pid']);
  }
  

  findFirstdatanode(pid: string) {
    this.service.getChildren(pid).subscribe(res => {
      if (res[0]['datanode']) {
        this.router.navigate(['/article', res[0]['pid']]);
      } else {
        this.findFirstdatanode(res[0]['pid']);
      }
    });
  }

  

}
