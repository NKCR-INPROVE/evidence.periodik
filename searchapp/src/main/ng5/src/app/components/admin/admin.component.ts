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

  ngOnInit() {
  }

  constructor(
    public state: AppState,
    private service: AppService,
  private router: Router) { }

  ngAfterViewInit() {
    if (this.state.config) {
      this.initTiny();
    } else {
      this.subscriptions.push(this.state.configSubject.subscribe(val => {
        this.initTiny();
      }));
    }
  }
  
  addJournal(){
    
  }
  
  saveJournals(){
    
  }
  
  setCtx(ctx){
    
            this.router.navigate(['k5journals', ctx['name'], 'home']);
  }

  initData() {

    this.fillMenu();
    this.service.getJournals().subscribe();
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
      /*
      file_picker_types: 'file image media',

      file_picker_callback: function(cb, value, meta) {
        console.log(cb, value, meta);
        that.browseFiles();
      },
      file_browser_callback: function(field_name, url, type, win) {
        that.win = win;
        that.field_name = field_name;
        console.log(win);
        that.browseFiles();
        //win.document.getElementById(field_name).value = 'my browser value';
      },
      
      images_upload_handler: function (blobInfo, success, failure) {
        console.log(blobInfo);
        var xhr: XMLHttpRequest;
        var formData;
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', 'lf?action=UPLOAD&id=' + that.selected);
        xhr.onload = function() {
          var json;

          if (xhr.status != 200) {
            failure('HTTP Error: ' + xhr.status);
            return;
          }
          json = JSON.parse(xhr.responseText);

          if (!json || typeof json.location != 'string') {
            failure('Invalid JSON: ' + xhr.responseText);
            return;
          }
          success(json.location);
        };
        formData = new FormData();
        console.log(blobInfo.filename(), blobInfo.name());
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
      },

      file_picker_callback: function(cb, value, meta) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('name', 'file');
        //input.setAttribute('accept', 'image/*');

        // Note: In modern browsers input[type="file"] is functional without 
        // even adding it to the DOM, but that might not be the case in some older
        // or quirky browsers like IE, so you might want to add it to the DOM
        // just in case, and visually hide it. And do not forget do remove it
        // once you do not need it anymore.

        input.onchange = function() {
          var file = this['files'][0];

          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function() {
            // Note: Now we need to register the blob in TinyMCEs image blob
            // registry. In the next release this part hopefully won't be
            // necessary, as we are looking to handle it internally.
            var id = 'blobid' + (new Date()).getTime();
            var blobCache = tinymce.activeEditor.editorUpload.blobCache;
            var base64 = reader.result.split(',')[1];
            var blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);

            // call the callback and populate the Title field with the file name
            console.log(cb);
            cb(blobInfo.blobUri(), { title: file.name });
          };
        };

        input.click();
      },

*/
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
    //          console.log(content);
    //          if(1<2){
    //            return;
    //          }
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
      this.saved = !res.hasOwnProperty('error');
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
