import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {Router} from '@angular/router';

import {AppService} from '../../services/app.service';
import {AppState} from '../../app.state';
import {Criterium} from '../../models/criterium';

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
    parentJournal: any;
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
        private state: AppState) {}

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
        if (mods["mods:relatedItem"] && mods["mods:relatedItem"]["mods:part"]) {

            let part = mods["mods:relatedItem"]["mods:part"];
            if (part.hasOwnProperty('length')) {
                for (let i in part) {
                    if (part[i].hasOwnProperty('mods:extent')) {

                        this.rozsah = part[i]["mods:extent"]["mods:start"] +
                            ' - ' + part[i]["mods:extent"]["mods:end"];
                    }
                }
            } else if (part["mods:extent"]) {
                this.rozsah = part["mods:extent"]["mods:start"] +
                    ' - ' + part["mods:extent"]["mods:end"];
            }
        }

        this.service.getViewed(this.article['pid']).subscribe(res => {
            this.viewed = res;
        });

        this.titleInfo = mods["mods:titleInfo"];

        this.setTitleInfo();
        this.setDetails();
        this.setNames(mods);
        //console.log(mods);
        if (this.active) {
            setTimeout(() => {
                this.elementRef.nativeElement.scrollIntoView();
            }, 100);

        }
    }

    setDetails() {
        this.service.getJournal(this.article['parents'][0]).subscribe(res => {
            this.parentJournal = res;
        });
    }


    setTitleInfo() {

        let modsLang = this.langsMap[this.lang];

        if (this.titleInfo.hasOwnProperty('length')) {
            this.title = this.titleInfo[0]["mods:title"];
            for (let i in this.titleInfo) {
                if (this.titleInfo[i]["lang"] === modsLang) {
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
    
    namePart(namePart: any){
      if (typeof namePart === 'string') {
          this.authors.push(namePart);
      } else {
          if (typeof namePart[0] === 'string') {
              this.authors.push(namePart[0]);
          } else {
              //Chceme nejdriv prijmeni a potom jmeno
              if (namePart[0]['type'] === 'family') {
                  this.authors.push(namePart[0]['content'] + ' ' + namePart[1]['content']);
              } else {
                  this.authors.push(namePart[1]['content'] + ' ' + namePart[0]['content']);
              }
          }
      }
    }

    setNames(mods) {
        //name/type="personal"	namepart/type="family"
        //name/type="personal"	namePart/type"given"
      
      //https://journals.lib.cas.cz/k5journals/article/uuid%3A2aabc1e5-c217-4a71-846f-95bf0ba9d94b
      
      //http://localhost:4200/article/uuid%3A2aabc1e5-c217-4a71-846f-95bf0ba9d94b
      if (this.article.pid === 'uuid:2aabc1e5-c217-4a71-846f-95bf0ba9d94b'){
        console.log(mods["mods:name"]);
      }
        if (mods.hasOwnProperty("mods:name")) {
            let name = mods["mods:name"];
            if (name.hasOwnProperty('length')) {
                for (let i in name) {
                    let namePart = name[i]["mods:namePart"];
                    this.namePart(namePart);
                }
            } else {
                if (name["type"] === 'personal' && name.hasOwnProperty("mods:namePart")) {
                    let namePart = name["mods:namePart"];
                    this.namePart(namePart);
                }
            }

        }
    }

    ngOnDestroy() {
        this.langObserver.unsubscribe();
    }

    onAuthorClicked(s: string) {
        //    this.onSearchAuthor.emit(s);
        let c = new Criterium();
        c.field = 'autor';
        c.value = '"' + s + '"';
        this.router.navigate(['/hledat/cokoliv', {criteria: JSON.stringify([c]), start: 0}])
    }

}
