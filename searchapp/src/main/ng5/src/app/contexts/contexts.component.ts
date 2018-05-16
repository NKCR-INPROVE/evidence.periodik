import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {AppState} from 'app/app.state';

@Component({
  selector: 'app-contexts',
  templateUrl: './contexts.component.html',
  styleUrls: ['./contexts.component.scss']
})
export class ContextsComponent implements OnInit {

  constructor(
    public state: AppState,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => Observable.of(params['ctx'])).subscribe(ctx => {
        if(ctx){
          this.state.ctx = ctx;
        } else {
          this.state.ctx = "journal";
        }
        if (this.state.config){
          console.log(ctx);
        } else {
          console.log('noconfig');
        }
      });
  }

}
