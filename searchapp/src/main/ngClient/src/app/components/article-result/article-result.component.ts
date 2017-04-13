import { Component, OnInit, Input } from '@angular/core';

import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';

@Component({
  selector: 'app-article-result',
  templateUrl: './article-result.component.html',
  styleUrls: ['./article-result.component.scss']
})
export class ArticleResultComponent implements OnInit {
  @Input('article') article;
  
  rozsah: string;
  author: string;
  
  constructor(
    private service: AppService,
    private state: AppState) { }

  ngOnInit() {
    this.service.getMods(this.article['pid']).subscribe(res =>{
      //console.log(res);
      let mods = res["mods:modsCollection"]["mods:mods"];
      if(mods["mods:relatedItem"] && mods["mods:relatedItem"]["mods:part"] && mods["mods:relatedItem"]["mods:part"]["mods:extent"] ){
        this.rozsah = res["mods:modsCollection"]["mods:mods"]["mods:relatedItem"]["mods:part"]["mods:extent"]["mods:start"] +
        ' - ' + res["mods:modsCollection"]["mods:mods"]["mods:relatedItem"]["mods:part"]["mods:extent"]["mods:end"];
      }
      let n = mods["mods:name"]["mods:namePart"] || null;
      if(n){
        this.author = n[0]['#text'] + ' ' + n[1]['#text'];
      }
      
    });
  }

}
