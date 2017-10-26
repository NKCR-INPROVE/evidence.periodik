import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppService } from '../../app.service';
import { AppState } from '../../app.state';

declare var tinymce: any;


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  menu: any = null;
  selected: string = 'help';
  visibleChanged: boolean = false;
  saved: boolean = false;

  text: string;
  elementId: string = 'editEl';

  editor;

  ngOnInit() {
  }

  constructor(
    public state: AppState,
    private service: AppService) { }

  ngAfterViewInit() {
    var that = this;
    tinymce.init({
      selector: '#' + this.elementId,
      menubar: false,
      plugins: ['link', 'paste', 'table', 'save', 'code', 'image'],
      toolbar: 'save | undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code',

      theme: "modern",
      skin_url: 'assets/skins/light',
      //images_upload_url: 'img?action=UPLOAD&id=' + this.selected,
      
      images_upload_handler: function (blobInfo, success, failure) {
        var xhr: XMLHttpRequest;
        var formData;
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', 'img?action=UPLOAD&id=' + that.selected);
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
        //formData.append('file', blobInfo.blob(), fileName(blobInfo));
        console.log(blobInfo.filename(), blobInfo.name());
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
      },

      file_picker_callback: function(cb, value, meta) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('name', 'file');
        input.setAttribute('accept', 'image/*');

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
            cb(blobInfo.blobUri(), { title: file.name });
          };
        };

        input.click();
      },


      file_browser_callback_types: 'file image media',
      setup: editor => {
        this.editor = editor;
        this.initData();
      },
      save_oncancelcallback: function() { console.log('Save canceled'); },
      save_onsavecallback: () => this.save()
    });
  }

  initData() {

    if (this.state.config) {
      this.fillMenu();
    } else {
      this.subscriptions.push(this.state.configSubject.subscribe(val => {
        this.fillMenu();
      }));
    }

    this.subscriptions.push(this.service.langSubject.subscribe(val => {
      this.getText();
    }));
  }


  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
    tinymce.remove(this.editor);
  }

  fillMenu() {
    this.menu = this.state.config['editable_pages'];
    

    this.getText();
  }

  getText() {
    this.service.getText(this.selected).subscribe(t => {
      this.text = t;
      this.editor['settings']['images_upload_url'] = 'img?action=UPLOAD&name=' + this.selected;
      this.editor.setContent(this.text);
      console.log(this.editor.settings);
      //images_upload_url: 'img?action=UPLOAD&name=' + this.selected,
    });
  }

  select(m: string, m1: string) {
    if (m1) {
      this.selected = m + '/' + m1;
    } else {
      this.selected = m;
    }
    this.saved = false;
    this.getText();
  }

  save() {

    const content = this.editor.getContent();
    
    this.service.saveText(this.selected, content).subscribe(res => {
      console.log(res);
      this.saved = !res.hasOwnProperty('error');
    });
  }

  changeVisible() {
    this.visibleChanged = true;
    //console.log(this.menu);
  }

}
