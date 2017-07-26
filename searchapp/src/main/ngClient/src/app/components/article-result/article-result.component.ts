import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Router } from '@angular/router';

import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';
import { Criterium } from '../../models/criterium';

@Component({
  selector: 'app-article-result',
  templateUrl: './article-result.component.html',
  styleUrls: ['./article-result.component.scss']
})
export class ArticleResultComponent implements OnInit {
  @Input('article') article;
  @Input('active') active: boolean;
  langObserver: Subscription;

  rozsah: string;
  authors: string[] = [];
  
  titleInfo: any;
  title: string;
  subTitle: string;
  nonSort: string;
  
  viewed: number = 0;
  
  lang: string;
  
  langsMap = {
    'cs': 'cze',
    'en': 'eng'
  };

  constructor(
    private router: Router,
  private elementRef: ElementRef,
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

    //let mods = this.article['mods']["mods:modsCollection"]["mods:mods"];

    let mods = JSON.parse(this.article['mods']);
    if (mods["mods:relatedItem"] && mods["mods:relatedItem"]["mods:part"] && mods["mods:relatedItem"]["mods:part"]["mods:extent"]) {
      this.rozsah = mods["mods:relatedItem"]["mods:part"]["mods:extent"]["mods:start"] +
        ' - ' + mods["mods:relatedItem"]["mods:part"]["mods:extent"]["mods:end"];
    }
    
    this.service.getViewed(this.article['pid']).subscribe(res => this.viewed = res);
    
    this.titleInfo = mods["mods:titleInfo"];
    
    this.setTitleInfo();
    this.setNames(mods);
    //console.log(mods);
    if(this.active){
      setTimeout(() => {
        this.elementRef.nativeElement.scrollIntoView();
      }, 100);
      
    }
  }


  setTitleInfo() {
    
    let modsLang = this.langsMap[this.lang];
    
    if (this.titleInfo.hasOwnProperty('length')) {
      this.title = this.titleInfo[0]["mods:title"];
      for(let i in this.titleInfo){
        if (this.titleInfo[i]["lang"] === modsLang){
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
          if(name[i]["type"] === 'personal' && namePart){
            //Chceme nejdriv prijmeni a potom jmeno
            if(namePart[0]['type'] === 'family'){
              this.authors.push(namePart[0]['content'] + ' ' + namePart[1]['content']);
            } else {
              this.authors.push(namePart[1]['content'] + ' ' + namePart[0]['content']);
            }
          }
        }
      } else {
        let namePart = name["mods:namePart"];
        if(name["type"] === 'personal' && name.hasOwnProperty("mods:namePart")){
          //Chceme nejdriv prijmeni a potom jmeno
          if(namePart[0]['type'] === 'family'){
            this.authors.push(namePart[0]['content'] + ' ' + namePart[1]['content']);
          } else {
            this.authors.push(namePart[1]['content'] + ' ' + namePart[0]['content']);
          }
          
        }
      }
      
    }
  }

  ngOnDestroy() {
    this.langObserver.unsubscribe();
  }
  
  onAuthorClicked(s: string){
//    this.onSearchAuthor.emit(s);
    let c = new Criterium();
    c.field = 'autor';
    c.value = '"' + s + '"';
    this.router.navigate(['/hledat/cokoliv', {criteria: JSON.stringify([c]), start: 0}])
  }

}
