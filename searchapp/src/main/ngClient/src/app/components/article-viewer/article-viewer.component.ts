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

  siblingIndex: number;

  constructor(
    private service: AppService,
    public state: AppState,
    private route: ActivatedRoute,
    private router: Router) {

    this.afterLoad = this.afterLoad.bind(this);
  }

  ngOnInit() {

    this.route.params
      .switchMap((params: Params) => Observable.of(params['pid'])).subscribe(pid => {
        this.pid = pid;
        if (this.state.config) {
          this.setData();
        }

      });

    this.state.configSubject.subscribe(
      () => {
        this.setData();
      }
    );
  }

  setData() {
    if (!this.pid) {
      return;
    }
    this.fullSrc = null;
    this.loading = true;
    this.service.getItem(this.pid).subscribe(res => {
      if (res['datanode']) {
        this.article = res;

        if (this.article.hasOwnProperty("pdf")) {
          this.isPdf = true;
          this.fullSrc = this.state.config['context'] + 'img?uuid=' + this.pid + '&stream=IMG_FULL&action=GETRAW';
        } else {
          this.isPdf = false;
          this.fullSrc = this.state.config['context'] + 'img?uuid=' + this.pid + '&stream=IMG_FULL&action=GETRAW';
          this.loading = false;
        }
        let ctx = res['context'][0];
        let parent = ctx[ctx.length - 2]['pid'];
        if (!this.journal || this.journal.pid !== parent) {
          this.service.getJournal(parent).subscribe((a) => {
            if (a.pid) {

              this.journal = a;

              this.service.getArticles(a['pid']).subscribe(res => {
                this.service.setArticles(this.journal, res);

              });
              this.service.getMods(a['pid']).subscribe(mods => this.journal.mods = mods);
              this.service.getSiblings(a['pid']).subscribe(siblings => {
                this.journal.siblings = siblings;
                //console.log(siblings);
                for (let i = 0; i < this.journal.siblings.length; i++) {
                  if (this.journal.siblings[i]['pid'] === this.journal.pid) {
                    this.siblingIndex = i;
                    break;
                  }
                }
              });
            }

          });
        }
      } else {
        this.findFirstdatanode(this.pid);
      }
    });
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

  afterLoad(pdf: any) {
    this.loading = false;
  }

  zoomIn() {
    this.zoom = this.zoom + .5;
  }

  zoomOut() {
    this.zoom = this.zoom - .5;
  }

  next() {
    let pid = this.journal.siblings[this.siblingIndex + 1]['pid'];
    this.journal = null;
    this.router.navigate(['/article', pid]);
  }

  prev() {
    let pid = this.journal.siblings[this.siblingIndex - 1]['pid'];
    this.journal = null;
    this.router.navigate(['/article', pid]);
  }

  hasNext() {
    if (this.journal.siblings) {
      return this.siblingIndex < this.journal.siblings.length - 1;
    } else {
      return false;
    }
  }

  hasPrev() {
    return this.siblingIndex > 0;
  }

}
