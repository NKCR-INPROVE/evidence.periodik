import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';

@Component({
  selector: 'app-archiv',
  templateUrl: './archiv.component.html',
  styleUrls: ['./archiv.component.scss']
})
export class ArchivComponent implements OnInit {
  
  currentPid: string;
  currentItem: any;
  items: any[];
  parentItems: any[];
  currentParent: string;
  cache : any = {};

  constructor(
    private service: AppService,
    private state: AppState,
    private router: Router
    ) { }

  ngOnInit() {
    this.initData();
    this.state.stateChangedSubject.subscribe(
      () => {
        this.initData();
      }
    );
  }
  
  isRoot(){
    return this.state.config && this.currentPid === this.state.config['journal'];
  }
  
  goToRoot(){
    this.parentItems = []; 
    this.setItems(this.state.config['journal'], null);
  }
  
  drillDown(pid:string){
    //this.parentItems = this.cache[this.currentPid]['items'];
    this.setItems(pid, this.currentPid);
  }
  
  setItems(pid: string, parent: string){
    //let parent = this.currentPid;
    this.currentPid = pid;
    this.service.getItem(this.currentPid).subscribe(res => {
      console.log(res);
      this.currentItem = res;
    });
    if(!this.cache.hasOwnProperty(this.currentPid)){
      this.service.getChildren(this.currentPid).subscribe(res => {
        if(res[0]['datanode']){
          this.router.navigate(['/article', res[0]['pid']]);
        }else{
          this.cache[this.currentPid] = {items: res, parent: parent};
          this.items = res;

          if(this.cache.hasOwnProperty(parent)){
            this.parentItems = this.cache[parent]['items'];
            this.currentParent = parent;
          } else {
            this.parentItems = [];
            this.currentParent = null;
          }
        }
      
      });
    } else {
      this.items = this.cache[this.currentPid]['items'];
      let p = this.cache[this.currentPid]['parent'];
      if(this.cache.hasOwnProperty(p)){
        this.parentItems = this.cache[p]['items'];
        this.currentParent = p;
      } else {
        this.parentItems = [];
          this.currentParent = null;
      }
    }
  }

  initData() {
    if (this.state.actualNumber) {
      if(!this.currentPid){
        this.setItems(this.state.config['journal'], null);
      }
    }
  }
  
  img(pid: string){
    return this.state.config['context'] + 'img?uuid=' + pid + '&stream=IMG_THUMB&action=SCALE&scaledHeight=140';
  }

}
