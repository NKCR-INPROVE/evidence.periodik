import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppService {

  //Observe language
  public _langSubject = new Subject();
  public langSubject: Observable<any> = this._langSubject.asObservable();
  
  constructor(private translate: TranslateService) { }
  
  
  changeLang(lang: string) {
    console.log('lang changed');
    //this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this._langSubject.next(lang);
  }

}
