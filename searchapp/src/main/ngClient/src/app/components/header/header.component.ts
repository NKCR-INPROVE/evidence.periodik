import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  currentLang: string = 'cs';

  constructor(private appservice: AppService) { }

  ngOnInit() {
    this.appservice.langSubject.subscribe(val=> {
      console.log(val);
      this.currentLang = val;
    });
  }
  
  
  changeLang(lang: string){
    this.appservice.changeLang(lang);
  }

}
