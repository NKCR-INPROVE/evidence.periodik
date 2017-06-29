import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';

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

  subscriptions: Subscription[] = [];

  menu: any[] = [];
  selected: string = 'home';
  visibleChanged: boolean = false;
  saved: boolean = false;

  text: string;
  elementId: string = 'editEl';

  editor;

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      menubar: false,
      plugins: ['link', 'paste', 'table'],
      toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      skin_url: 'assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;
      },
      
    });
    
    

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
  


  constructor(
    public state: AppState,
    private service: AppService) { }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
  }

  fillMenu() {
    for (let m in this.state.config['menu']) {
      this.menu.push({ label: m, menu: this.state.config['menu'][m] })
    }

    this.getText();
  }
  
  getText(){
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
        menuToSave[this.menu[i].label] = this.menu[i].menu;
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

}
