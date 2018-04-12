import { Component, OnInit, ViewChild } from '@angular/core';

import { AppService } from '../../services/app.service';
import { AppState } from '../../app.state';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  @ViewChild('loginuser') loginuser: any;
  loginError: boolean = false;

  constructor(
    public state: AppState,
    public service: AppService) { }

  ngOnInit() {
  }

  focusu(){
    setTimeout(() => {
        this.loginuser.nativeElement.focus();
      }, 100);

  }

  focusp(e, el){
      el.focus();
  }

}
