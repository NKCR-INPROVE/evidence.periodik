import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';

@Component({
  selector: 'app-article-result',
  templateUrl: './article-result.component.html',
  styleUrls: ['./article-result.component.scss']
})
export class ArticleResultComponent implements OnInit {
  @Input('article') article;
  langObserver: Subscription;

  rozsah: string;
  authors: string[] = [];
  
  titleInfo: any;
  title: string;
  subTitle: string;
  nonSort: string;
  
  lang: string;
  
  langsMap = {
    'cs': 'cze',
    'en': 'eng'
  };

  constructor(
    private service: AppService,
    private state: AppState) { }

  ngOnInit() {
    this.lang = this.state.currentLang;
    this.langObserver = this.service.langSubject.subscribe(
      (lang) => {
        this.lang = lang;
        this.setTitleInfo();

      }
    );

    let mods = this.article['mods']["mods:modsCollection"]["mods:mods"];
    if (mods["mods:relatedItem"] && mods["mods:relatedItem"]["mods:part"] && mods["mods:relatedItem"]["mods:part"]["mods:extent"]) {
      this.rozsah = mods["mods:relatedItem"]["mods:part"]["mods:extent"]["mods:start"] +
        ' - ' + mods["mods:relatedItem"]["mods:part"]["mods:extent"]["mods:end"];
    }
    

    this.titleInfo = mods["mods:titleInfo"];
    
    
    this.setTitleInfo();
    this.setNames(mods);
    
    
    //console.log(mods);
  }


  setTitleInfo() {
    
    let modsLang = this.langsMap[this.lang];
    
    if (this.titleInfo.hasOwnProperty('length')) {
      this.title = this.titleInfo[0]["mods:title"];
      for(let i in this.titleInfo){
        if (this.titleInfo[i]["@lang"] === modsLang){
           this.title = this.titleInfo[i]["mods:title"];
           this.subTitle = this.titleInfo[i]["mods:subTitle"];
          this.nonSort = this.titleInfo[i]["mods:nonSort"];
        }
      }
    } else {
      this.title = this.titleInfo["mods:title"];
      this.subTitle = this.titleInfo["mods:subTitle"];
      this.nonSort = this.titleInfo["mods:nonSort"];
    }
  }
  
  setNames(mods){
    //name/type="personal"	namepart/type="family"
    //name/type="personal"	namePart/type"given"
    if (mods.hasOwnProperty("mods:name")) {
      let name = mods["mods:name"];
      if (name.hasOwnProperty('length')) {
        for(let i in name){
          let namePart = name[i]["mods:namePart"];
          if(name[i]["@type"] === 'personal' && namePart){
            this.authors.push(namePart[0]['#text'] + ' ' + namePart[1]['#text']);
          }
        }
      } else {
        let namePart = name["mods:namePart"];
        if(name["@type"] === 'personal' && namePart){
          this.authors.push(namePart[0]['#text'] + ' ' + namePart[1]['#text']);
        }
      }
      
    }
  }

  ngOnDestroy() {
    this.langObserver.unsubscribe();
  }

}
