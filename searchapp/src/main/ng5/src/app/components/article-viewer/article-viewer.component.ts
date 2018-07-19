import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs/Rx';

import {AppService} from '../../services/app.service';
import {AppState} from '../../app.state';
import {Journal} from '../../models/journal.model';
import Utils from '../../services/utils';
import {PdfViewerComponent} from 'ng2-pdf-viewer';

@Component({
  selector: 'app-article-viewer',
  templateUrl: './article-viewer.component.html',
  styleUrls: ['./article-viewer.component.scss']
})
export class ArticleViewerComponent implements OnInit {

  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  @ViewChild('linkModal') private linkModal: any;

  pid: string;
  article: any;

  fullSrc: string;
  isPdf: boolean = false;
  downloadFilename: string;
  loading: boolean = true;
pagesRendered: number = 0;
numPages: number = -1;

  zoom: number = 1.0;

  journal: Journal;

  siblingIndex: number;
  isPrintSupported: boolean = false;
  showShare: boolean = false;
  
  doi: string;

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
    this.service.setViewed(this.pid).subscribe(res => {
      //console.log('viewed!');
    });
    this.service.getItem(this.pid).subscribe(res => {
      if (res['datanode']) {
        this.article = res;
        
        this.pagesRendered = 0;
        this.numPages = -1;

        if (this.article.hasOwnProperty("url_pdf")) {
          this.isPdf = true;
          this.downloadFilename = this.pid + '.pdf';
          this.fullSrc = this.state.config['context'] + 'img?uuid=' + this.pid + '&stream=IMG_FULL&action=GETRAW';
        } else {
          this.isPdf = false;
          this.downloadFilename = this.pid;
          this.fullSrc = this.state.config['context'] + 'img?uuid=' + this.pid + '&stream=IMG_FULL&action=GETRAW';
          this.loading = false;
        }
        
        this.doi = Utils.getDoi(JSON.parse(this.article['mods']));
        //let ctx = res['context'][0];
        //        let parent = ctx[ctx.length - 2]['pid'];
        let parent = res['parents'][0];
        if (!this.journal || this.journal.pid !== parent) {
          this.service.getJournal(parent).subscribe((a) => {
            if (a.pid) {

              this.journal = a;
              this.service.getMods(a['pid']).subscribe(mods => {
                this.journal.mods = mods;

                this.service.getArticles(a['pid']).subscribe(res => {
                  //this.service.setArticles(this.journal, res);
                  this.journal.setArticles(res, this.state.config['mergeGenres']);
                });
              });
              //this.service.getSiblings(a['pid']).subscribe(siblings => {
              this.service.getChildren(a['parent'], 'asc').subscribe(siblings => {
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
    this.service.getChildren(pid, 'asc').subscribe(res => {
      if (res[0]['datanode']) {
        this.router.navigate(['/'+this.state.ctx.ctx+'/article', res[0]['pid']]);
      } else {
        this.findFirstdatanode(res[0]['pid']);
      }
    });
  }
  
  searchInPdf() {
    if (this.state.fultextQuery !== ''){
  this.pdfComponent.pdfFindController.executeCommand('find', {
    caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: this.state.fultextQuery
  });
    }
}

pageRendered(e: CustomEvent) {
  //console.log('(page-rendered)', e);
  this.pagesRendered++;
  if (this.pagesRendered === this.numPages){
    this.searchInPdf();
  }
}

  afterLoad(pdf: any) {
  this.numPages = pdf.numPages;
    this.loading = false;
  }

  zoomIn() {
    this.zoom = this.zoom + .5;
  }

  zoomOut() {
    this.zoom = this.zoom - .5;
  }

  minimize() {
    this.state.fullScreenChanged(false);
  }

  maximize() {
    this.state.fullScreenChanged(true);
  }

  next() {
    if (this.hasNext()) {
      let pid = this.journal.siblings[this.siblingIndex + 1]['pid'];
      this.journal = null;
      this.router.navigate(['/'+this.state.ctx.ctx+'/article', pid]);
    }
  }

  prev() {
    if (this.hasPrev()) {
      let pid = this.journal.siblings[this.siblingIndex - 1]['pid'];
      this.journal = null;
      this.router.navigate(['/'+this.state.ctx.ctx+'/article', pid]);
    }
  }

  toggleShare() {
    this.showShare = !this.showShare;
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

  url() {
    return window.location.href;
    //return this.router.url;
  }

  _socialUrl() {
    return window.location.href;
    //return this.route.snapshot.pathFromRoot;
  }

  facebookShare() {
    var share = "https://www.facebook.com/sharer/sharer.php?u=" + this._socialUrl();
    window.open(share, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    this.toggleShare();
    return false;
  }

  googlePlusShare() {
    var share = "https://plus.google.com/share?url=" + this._socialUrl();
    window.open(share, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    this.toggleShare();
    return false;
  }
  
  linkShare(){
    this.linkModal.show();
    this.toggleShare();
  }


}
