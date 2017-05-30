import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

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
  cache: any = {};

  constructor(
    private service: AppService,
    private state: AppState,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    //this.initData();
    this.route.params
      .switchMap((params: Params) => Observable.of(params['pid'])).subscribe(pid => {
        if (pid) {
          this.currentPid = pid;
          if (this.state.config) {
            this.setItems(pid);
          }
        } else {
          this.initData();
        }


      });

    this.state.configSubject.subscribe(
      () => {
        this.initData();
      }
    );
  }
  
  setMainClass(){
    
        let sufix = this.isRoot() ? '-level-1' : '-level-2';
        this.state.mainClass = 'app-page-archiv' + sufix;
        this.state.classChanged();
  }

  isRoot() {
    return this.state.config && this.currentPid === this.state.config['journal'];
  }

  goToRoot() {
    this.parentItems = [];
    this.setItems(this.state.config['journal']);
  }

  drillDown(pid: string) {
    //this.parentItems = this.cache[this.currentPid]['items'];
    this.setItems(pid);
  }

  setItems(pid: string) {
    //let parent = this.currentPid;
    this.currentPid = pid;
          this.setMainClass();
    this.service.getItem(this.currentPid).subscribe(res => {
      this.currentItem = res;
      //let ctx = res['context'][0];
      if (res['parents'] > 1) {
        this.currentParent = res['parents'][0];
      } else {
        this.currentParent = null;
      }

      if (!this.cache.hasOwnProperty(this.currentPid)) {
        this.service.getChildren(this.currentPid).subscribe(res => {
          if (res[0]['datanode']) {
            this.router.navigate(['/article', res[0]['pid']]);
          } else {
            this.cache[this.currentPid] = { items: res, parent: this.currentParent };
            this.items = res;

            if (this.currentParent === null) {
              this.parentItems = [];
            } else if (this.cache.hasOwnProperty(this.currentParent)) {
              this.parentItems = this.cache[this.currentParent]['items'];
              //this.currentParent = parent;
            } else {
              this.parentItems = [];
              //this.currentParent = parent;
              this.service.getChildren(this.currentParent).subscribe(res => {
                this.parentItems = res;
                //this.cache[this.currentParent] = {};
                this.cache[this.currentParent] = { items: res };
              });
            }
          }

        });
      } else {
        this.items = this.cache[this.currentPid]['items'];
        let p = this.cache[this.currentPid]['parent'];
        if (this.cache.hasOwnProperty(p)) {
          this.parentItems = this.cache[p]['items'];
          this.currentParent = p;
        } else {
          this.parentItems = [];
          this.currentParent = null;
        }
      }


    });

  }

  initData() {
    if (this.state.actualNumber) {
      if (!this.currentPid) {
        this.setItems(this.state.config['journal']);
      }
    } else {
      this.router.navigate(['home']);
    }
  }

  img(pid: string) {
    return this.state.config['context'] + 'img?uuid=' + pid + '&stream=IMG_THUMB&action=SCALE&scaledHeight=140';
  }

}
