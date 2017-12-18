import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {Router} from '@angular/router';

import {AppService} from '../../services/app.service';
import {AppState} from '../../app.state';
import {Criterium} from '../../models/criterium';

@Component({
    selector: 'app-article-info',
    templateUrl: './article-info.component.html',
    styleUrls: ['./article-info.component.scss']
})
export class ArticleInfoComponent implements OnInit {
    @Input('article') article;
    @Input('journal') journal;
    @Input('active') active: boolean;
    langObserver: Subscription;

    rozsah: string;
    authors: string[] = [];

    titleInfo: any;
    title: string;
    subTitle: string;
    nonSort: string;

    keywords: string[] = [];

    viewed: number = 0;

    lang: string;

    langsMap = {
        'cs': 'cze',
        'en': 'eng'
    };

    doi: string;
    isPeerReviewed: boolean = false;

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
                this.setData();

            }
        );
        this.setData();
    }

    ngOnChanges() {
        this.setData();
    }

    setData() {
        if (!this.article) {
            return;
        }

        this.authors = [];
        this.rozsah = "";


        this.title = "";
        this.subTitle = "";
        this.nonSort = "";

        this.keywords = [];

        this.viewed = 0;
        this.doi = "";
        this.isPeerReviewed = false;

        let mods = JSON.parse(this.article['mods']);
        if (mods["mods:relatedItem"] && mods["mods:relatedItem"]["mods:part"] && mods["mods:relatedItem"]["mods:part"]["mods:extent"]) {
            this.rozsah = mods["mods:relatedItem"]["mods:part"]["mods:extent"]["mods:start"] +
                ' - ' + mods["mods:relatedItem"]["mods:part"]["mods:extent"]["mods:end"];
        }

        this.titleInfo = mods["mods:titleInfo"];
        this.setTitleInfo();
        this.setNames(mods);

        if (mods.hasOwnProperty("mods:identifier")) {
            let ids = mods["mods:identifier"];
            if (ids.hasOwnProperty('length')) {
                for (let i in ids) {
                    if (ids[i]["type"] === 'doi') {
                        this.doi = ids[i]['content'];
                    }
                }
            } else {
                if (ids["type"] === 'doi') {
                    this.doi = ids['content'];
                }
            }
        }

        this.isPeerReviewed = this.article['genre'].indexOf('peer-reviewed') > -1;

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

    setNames(mods) {
        //name/type="personal"	namepart/type="family"
        //name/type="personal"	namePart/type"given"
        if (mods.hasOwnProperty("mods:name")) {
            let name = mods["mods:name"];
            if (name.hasOwnProperty('length')) {
                for (let i in name) {
                    let namePart = name[i]["mods:namePart"];
                    if (name[i]["type"] === 'personal' && namePart) {
                        //Chceme nejdriv prijmeni a potom jmeno
                        if (namePart[0]['type'] === 'family') {
                            this.authors.push(namePart[0]['content'] + ' ' + namePart[1]['content']);
                        } else {
                            this.authors.push(namePart[1]['content'] + ' ' + namePart[0]['content']);
                        }
                    }
                }
            } else {
                if (name["type"] === 'personal' && name.hasOwnProperty("mods:namePart")) {
                    let namePart = name["mods:namePart"];
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
            }

        }
    }

    setKeywords() {
        this.keywords = [];
    }

    ngOnDestroy() {
        this.langObserver.unsubscribe();
    }

    onAuthorClicked(s: string) {
        let c = new Criterium();
        c.field = 'autor';
        c.value = '"' + s + '"';
        this.router.navigate(['/hledat/cokoliv', {criteria: JSON.stringify([c]), start: 0}])
    }

}
