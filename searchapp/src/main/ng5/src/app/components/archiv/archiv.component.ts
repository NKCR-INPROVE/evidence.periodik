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
  
  visibleItems:number = 3;
  visibleParentItems: any[];
  currentParent: string = null;
  cache: any = {};

  isDataNode: boolean = false;

  volumeNumber: string;
  issueNumber: string;
  partName: string;

  sorts = [
    { label: "od nejnovějšího", dir: "desc" },
    { label: "od nejstaršího", dir: "asc" }
  ];
  currentSort = this.sorts[0];

  constructor(
    private service: AppService,
    public state: AppState,
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
          this.currentPid = null;
          this.initData();
        }
      });

    this.state.configSubject.subscribe(
      () => {
        this.initData();
      }
    );
  }

  setMainClass() {

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
  setSort(s) {
    this.currentSort = s;
    let x = s.dir === 'asc' ? 1 : -1;
    this.items.sort((a, b) => {
      return (a['idx'] - b['idx']) * x;
    });
  }

  drillDown(pid: string) {

    let p = {};
    p['pid'] = pid;
    this.router.navigate(['/archiv', p]);
    //    this.setItems(pid);
  }

  setFocus() {
    let el = document.getElementById('btn_' + this.currentPid);
    if (el) {
      el.focus();
    }
  }

  setItems(pid: string) {
    //let parent = this.currentPid;
    this.currentPid = pid;

    this.setMainClass();

    this.service.getItem(this.currentPid).subscribe(res => {
      if (this.currentPid === this.state.config['journal']) {
        this.currentItem = { pid: this.currentPid, parents: null, model: 'periodical' };
      } else {
        this.currentItem = res;
        //let ctx = res['context'][0];
        if (res['parents'].length > 0) {
          this.currentParent = res['parents'][0];
        } else {
          this.currentParent = null;
        }
        this.setDetails();
      }

      if (!this.cache.hasOwnProperty(this.currentPid)) {
        this.service.getChildren(this.currentPid).subscribe(res => {
          this.isDataNode = res[0]['datanode'];
          //if (res[0]['datanode']) {
          //this.router.navigate(['/article', res[0]['pid']]);
          //} else {
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
          
          
          
          
          //}
          if (this.isDataNode) {
            this.items.sort((a, b) => {
              return a['idx'] - b['idx'];
            });
          }

        });
      } else {
        this.items = this.cache[this.currentPid]['items'];
        this.isDataNode = this.items[0]['datanode'];
        let p = this.cache[this.currentPid]['parent'];
        if (this.cache.hasOwnProperty(p)) {
          this.parentItems = this.cache[p]['items'];
          this.currentParent = p;
        } else {
          this.parentItems = [];
          this.currentParent = null;
        }
      }
      
      this.visibleParentItems = [];
      if(this.parentItems && this.parentItems.length > 0){
        let start = 0;
        for (let idx = 0; idx < this.parentItems.length; idx++){
          if (this.parentItems[idx].pid === this.currentPid){
            start = idx;
          }
        }

        //visibleItems should be odd

        start = Math.max(0, start - Math.floor(this.visibleItems/2));

        let end = Math.min(start + this.visibleItems, this.parentItems.length);
        start = Math.max(0, end - this.visibleItems);
        for (let i = start; i < end; i++){
          this.visibleParentItems.push(this.parentItems[i]);
        }

//        console.log(start, end, this.visibleParentItems);
      }


    });
    this.setFocus();
  }

  initData() {
    if (this.state.actualNumber) {
      if (!this.currentPid) {
        this.setItems(this.state.config['journal']);
      } else {
        this.setItems(this.currentPid);
      }
    } else {
      //this.router.navigate(['home']);
      setTimeout(() => {
        this.initData();
      }, 100);
    }
  }

  isHiddenByGenre(genres: string[]) {
    return this.service.isHiddenByGenre(genres);
  }

  setDetails() {
    let mods = JSON.parse(this.currentItem['mods']);
    if (this.currentItem['model'] === 'periodicalvolume') {

      if (mods['mods:originInfo']) {
        //this.year = mods['mods:originInfo']['mods:dateIssued'];
        if (mods['mods:titleInfo']) {
          this.volumeNumber = mods['mods:titleInfo']['mods:partNumber'];
        }
      } else {
        //podpora pro starsi mods. ne podle zadani
        if (mods['part'] && mods['part']['date']) {
          //this.year = mods['part']['date'];
        } else if (mods['mods:part'] && mods['mods:part']['mods:date']) {
          //this.year = mods['mods:part']['mods:date'];
        }

        if (mods['part'] && mods['part']['detail'] && mods['part']['detail']['number']) {
          this.issueNumber = mods['part']['detail']['number'];
        } else if (mods['mods:part'] && mods['mods:part']['mods:detail'] && mods['mods:part']['mods:detail']['mods:number']) {
          this.issueNumber = mods['mods:part']['mods:detail']['mods:number'];
        }
      }
    } else if (this.currentItem['model'] === 'periodicalitem') {
      if (mods['mods:originInfo']) {
        //this.year = mods['mods:originInfo']['mods:dateIssued'];
        if (mods['mods:titleInfo']) {
          this.issueNumber = mods['mods:titleInfo']['mods:partNumber'];
          this.partName = mods['mods:titleInfo']['mods:partName'];
        }
      } else {


        //podpora pro starsi mods. ne podle zadani
        if (mods['part'] && mods['part']['detail'] && mods['part']['detail']['number']) {
          this.issueNumber = mods['part']['detail']['number'];
        } else if (mods['mods:part'] && mods['mods:part']['mods:detail'] && mods['mods:part']['mods:detail']['mods:number']) {
          this.issueNumber = mods['mods:part']['mods:detail']['mods:number'];
        }


      }
    }
  }


  img(pid: string) {
    return this.state.config['context'] + 'img?uuid=' + pid + '&stream=IMG_THUMB&action=SCALE&scaledHeight=140';
  }

}
