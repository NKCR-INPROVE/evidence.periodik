import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';
import { Journal } from '../../models/journal.model';

@Component({
  selector: 'app-article-viewer',
  templateUrl: './article-viewer.component.html',
  styleUrls: ['./article-viewer.component.scss']
})
export class ArticleViewerComponent implements OnInit {
  
  pid: string;
  article: any;
  
  fullSrc: string;
  isPdf: boolean = false;
  loading: boolean = true;
  
  zoom: number = 1.0;
  
  journal: Journal;

  constructor(
  private service: AppService,
  public state: AppState,
  private route: ActivatedRoute) {
  
    this.afterLoad = this.afterLoad.bind(this);
  }

  ngOnInit() {
    
    this.route.params
      .switchMap((params: Params) => Observable.of(params['pid'])).subscribe(pid => {
        console.log('params');
        this.pid = pid;
        
        if (this.state.config){
          this.setData();
        }
        
    });
    
    this.state.paramsSubject.subscribe(
      () => {
        this.setData();
      }
    );
    
    this.service.journal.subscribe((a) => {
      console.log('subs', a.pid);
        if (a.pid){
          this.journal = a;
        }
        //subs.unsubscribe();
    });
  }
  
  setData(){
    this.fullSrc = null;
    this.loading = true;
    this.service.getItem(this.pid).subscribe(res => {
      this.article = res;
      
      if (this.article.hasOwnProperty("pdf")){
        this.isPdf = true;
        this.fullSrc = this.state.config['context'] + 'img?uuid=' + this.pid + '&stream=IMG_FULL&action=GETRAW';
      } else {
        this.isPdf = false;
        this.fullSrc = this.state.config['context'] + 'img?uuid=' + this.pid + '&stream=IMG_FULL&action=GETRAW';
        this.loading = false;
      }
      let ctx = res['context'][0];
      let parent = ctx[ctx.length - 2]['pid'];
      console.log(parent);
      this.service.getJournalByPid(parent);
    });
  }
  
  afterLoad(pdf: any) {
    this.loading = false;
  }
  
  zoomIn(){
    this.zoom = this.zoom + .5;
  }
  
  zoomOut(){
    this.zoom = this.zoom - .5;
  }

}
