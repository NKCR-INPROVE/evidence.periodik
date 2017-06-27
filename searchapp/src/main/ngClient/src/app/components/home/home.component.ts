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
  actualInfo: string;
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
      this.setActualInfo();
      //this.img = 'img/item/' + this.state.actualNumber.pid + '/thumb';
    }
  }
  
  setActualInfo(){
    
    if (this.actual.mods) {
      let mods = this.actual.mods;
      if (this.actual.model === 'periodicalvolume') {
        
        if(mods['mods:originInfo']){
          this.actualInfo = mods['mods:originInfo']['mods:dateIssued'];
          if (mods['mods:titleInfo']) {
            this.actualInfo = mods['mods:titleInfo']['mods:partNumber'] + '/' + this.actualInfo;
          }
        } else {
        //podpora pro starsi mods. ne podle zadani
        //
          //console.log(mods);
          if(mods['part'] && mods['part']['date']){
            this.actualInfo  = mods['part']['date']; 
          } else if(mods['mods:part'] && mods['mods:part']['mods:date']){
            this.actualInfo = mods['mods:part']['mods:date']; 
          }
          
          if(mods['part'] && mods['part']['detail'] && mods['part']['detail']['number']){
            this.actualInfo = mods['part']['detail']['number'] + '/' + this.actualInfo;
          } else if(mods['mods:part'] && mods['mods:part']['mods:detail'] && mods['mods:part']['mods:detail']['mods:number']){
            this.actualInfo = mods['mods:part']['mods:detail']['mods:number'] + '/' + this.actualInfo;
          }
        }
      } else if (this.actual.model === 'periodicalitem') {
        
      
        if (mods['mods:originInfo']) {
          this.actualInfo = mods['mods:originInfo']['mods:dateIssued'];
          if (mods['mods:titleInfo']['mods:partNumber']) {
            this.actualInfo += ' ' + mods['mods:titleInfo']['mods:partNumber'] ;
          }
          if (mods['mods:titleInfo']['mods:partName']) {
            this.actualInfo +=  ' ' + mods['mods:titleInfo']['mods:partName'];
          }
        } else {
        
          //podpora pro starsi mods. ne podle zadani
          //
          //console.log(mods);
          if (mods['part'] && mods['part']['date']) {
            this.actualInfo = mods['part']['date'];
          } else if (mods['mods:part'] && mods['mods:part']['mods:date']) {
            this.actualInfo = mods['mods:part']['mods:date'];
          }

          if (mods['part'] && mods['part']['detail'] && mods['part']['detail']['number']) {
            this.actualInfo = mods['part']['detail']['number'];
          } else if (mods['mods:part'] && mods['mods:part']['mods:detail'] && mods['mods:part']['mods:detail']['mods:number']) {
            this.actualInfo = mods['mods:part']['mods:detail']['mods:number'];
          }
        }
          
      }
    } else {
//      this.appService.getMods(this.journal['pid']).subscribe(mods => {
//        this.journal.mods = mods;
//        this.details();
//      });
    }
    //     Úroveň: Ročník
    //§  Rok: originInfo/dateIssued
    //§  Číslo ročníku: titleInfo/partNumber
    //o   Úroveň: Číslo
    //§  Číslo čísla: titleInfo/partNumber
    //Speciální název čísla: titleInfo/partName


  }
  
  gotoArchiv(pid: string){
    this.router.navigate(['archiv/', pid])
  }
  

}
