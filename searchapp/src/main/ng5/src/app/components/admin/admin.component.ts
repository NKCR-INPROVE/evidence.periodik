import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';


import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
//import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { FileUploader } from 'ng2-file-upload';

import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';
import { Router} from '@angular/router';


declare var tinymce: any;

interface menuItem {
  route: string;
  visible: boolean;
};

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  @ViewChild('filesModal') filesModal;
  @ViewChild('childModal') public childModal: ModalDirective;


  subscriptions: Subscription[] = [];

  public uploader: FileUploader = new FileUploader({ url: 'lf?action=UPLOAD' });
  public coverUploader: FileUploader = new FileUploader({ url: 'lf?action=UPLOAD&cover=true' });

  //public modalRef: BsModalRef;

  menu: any[] = [];
  selected: string = 'home';
  visibleChanged: boolean = false;
  saved: boolean = false;

  text: string;
  elementId: string = 'editEl';
  editor;
  
  fileList: string[];
  selectedFile: string;

  indexUUID: string;
  indexed: boolean = false;
  coverMsg: string;
  
  newctx: string = '';

  ngOnInit() {
    
    this.service.getJournals().subscribe();
    this.subscriptions.push(this.state.configSubject.subscribe(val => {
        this.fillMenu();
        this.initTiny();
      }));
  }

  constructor(
    public state: AppState,
    private service: AppService,
  private router: Router) { }

  ngAfterViewInit() {
    if (this.state.config) {
      setTimeout(()=>{
        
      this.fillMenu();
      this.initTiny();
      }, 100);
    }
  }
  
  addJournal(){
    if(this.newctx !== ''){
      this.state.ctxs.push({ctx: this.newctx, color: "CCCCCC", journal: 'uuid:', showTitleLabel: true});
      this.newctx = '';
    }
  }
  
  saveJournals(){
    
  }
  
  setCtx(ctx: { ctx: string; color: string; journal: string; showTitleLabel: boolean; }){
    this.service.getJournalConfig(ctx).subscribe();
    this.router.navigate([ctx['ctx'], 'admin']);
  }

  initData() {

    this.subscriptions.push(this.service.langSubject.subscribe(val => {
      this.getText();
    }));

  }

  initTiny() {
    this.uploader.onSuccessItem = (item, response, status, headers) => this.uploaded();
    this.coverUploader.onSuccessItem = (item, response, status, headers) => this.coverUploaded();

    var that = this;
    tinymce.init({
      selector: '#' + this.elementId,
      menubar: false,
      plugins: ['link', 'paste', 'table', 'save', 'code', 'image'],
      toolbar: 'save | undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code mybutton',
      skin_url: this.state.config['context'] + 'assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        this.initData();
        editor.addButton('mybutton', {
          tooltip: 'Insert link to file',
          icon: 'upload',
          //icon: false,
          onclick: function() {
            that.browseFiles();
            //editor.insertContent('&nbsp;<b>It\'s my button!</b>&nbsp;');
          }
        });
      },
      
      save_oncancelcallback: function() { console.log('Save canceled'); },
      save_onsavecallback: () => this.save()
    });
  }


  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
    tinymce.remove(this.editor);
  }

  fillMenu() {
    
    this.menu = [];
    for (let m in this.state.config['menu']) {
      this.menu.push({ label: m, menu: this.state.config['menu'][m]['submenu'], visible: this.state.config['menu'][m]['visible'] })
      //this.menu = this.state.config['menu'];
    }

    this.getText();
  }

  getText() {
    this.service.getText(this.selected).subscribe(t => {
      this.text = t;
      this.editor.setContent(this.text);
    });
  }

  select(m: string, m1: string) {
    if (m1) {
      this.selected = m + '/' + m1;
    } else {
      this.selected = m;
    }
    this.saved = false;
    this.indexed = false;
    this.getText();
  }

  save() {

    const content = this.editor.getContent();
    let m = null;
    if (this.visibleChanged) {
      let menuToSave = {};
      for (let i = 0; i < this.menu.length; i++) {
        menuToSave[this.menu[i].label] = {submenu:this.menu[i].menu, visible:this.menu[i].visible};
      }
      m = JSON.stringify(menuToSave);
    }
    this.service.saveText(this.selected, content, m).subscribe(res => {
      console.log(res);
      if(res.hasOwnProperty('error')){
        this.saved = !res.hasOwnProperty('error');
      } else {
        this.service.saveJournalConfig().subscribe(res2 => { 
          console.log(res2, this.state.ctxs);
          this.saved = !res2.hasOwnProperty('error');
            if(!res2.hasOwnProperty('error')){
              this.service.getJournalConfig(this.state.ctx).subscribe();
              this.service.switchStyle();
            }
        });
      }
    });
  }

  changeVisible() {
    this.visibleChanged = true;
    //console.log(this.menu);
  }

  index() {
    this.service.index(this.indexUUID).subscribe(res => {
      console.log(res);
      this.indexed = !res.hasOwnProperty('error');
    });
  }
  
  uploadFile(){
    this.uploader.uploadAll();
  }
  
  uploaded(){
    this.service.getUploadedFiles().subscribe(res => {
      this.fileList = res['files'];
    })
  }

  
  uploadCover(){
    this.coverUploader.uploadAll();
  }
  
  coverUploaded(){
    this.coverMsg = 'ok';
  }

public selectFile(f: string){
    this.selectedFile = f;
  
    this.childModal.hide();
    this.editor.insertContent('&nbsp;<a target="_blank" href="lf?action=GET_FILE&filename=' + this.selectedFile + '">' + this.selectedFile + '</a>&nbsp;');
}

  public browseFiles() {
    this.service.getUploadedFiles().subscribe(res => {
      this.fileList = res['files'];
    })
    
    this.childModal.show();
  }

  public closeFiles() {
    this.childModal.hide();
    //this.editor.insertContent('&nbsp;<b>' + this.selectedFile + '</b>&nbsp;');
  }

}
