import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';

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

  constructor(
  private service: AppService,
  public state: AppState,
  private route: ActivatedRoute) {
  
    this.afterLoad = this.afterLoad.bind(this);
  }

  ngOnInit() {
    
    this.route.params
      .switchMap((params: Params) => Observable.of(params['pid'])).subscribe(pid => {
        this.pid = pid;
        if (this.state.actualNumber){
          this.setData();
        }
        
    });
    
    this.state.stateChangedSubject.subscribe(
      () => {
        this.setData();
      }
    );
  }
  
  setData(){
    this.fullSrc = null;
    this.loading = true;
    this.service.getItemByPid(this.pid).subscribe(res => {
      this.article = res;
      
      if (this.article.hasOwnProperty("pdf")){
        this.isPdf = true;
        this.fullSrc = this.state.config['context'] + 'img?uuid=' + this.pid + '&stream=IMG_FULL&action=GETRAW';
      } else {
        this.isPdf = false;
        this.fullSrc = this.state.config['context'] + 'img?uuid=' + this.pid + '&stream=IMG_FULL&action=GETRAW';
        this.loading = false;
      }
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
