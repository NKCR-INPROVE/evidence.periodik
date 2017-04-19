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
  
  zoom: number = 1.0;

  constructor(
  private service: AppService,
  private state: AppState,
  private route: ActivatedRoute) { }

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
    this.service.getItemByPid(this.pid).subscribe(res => {
      this.article = res;
      
      if (this.article.hasOwnProperty("pdf")){
        this.isPdf = true;
        this.fullSrc = '/img?uuid=' + this.pid + '&stream=IMG_FULL&action=GETRAW';
      } else {
        this.isPdf = true;
        this.fullSrc = '/img?uuid=' + this.pid + '&stream=IMG_FULL&action=GETRAW';
      }
    });
  }
  
  zoomIn(){
    this.zoom = this.zoom + .5;
  }
  
  zoomOut(){
    this.zoom = this.zoom - .5;
  }

}
