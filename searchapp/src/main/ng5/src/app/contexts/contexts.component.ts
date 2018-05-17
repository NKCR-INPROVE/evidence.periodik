import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {AppState} from 'app/app.state';
import {AppService} from 'app/services/app.service';

@Component({
  selector: 'app-contexts',
  templateUrl: './contexts.component.html',
  styleUrls: ['./contexts.component.scss']
})
export class ContextsComponent implements OnInit {

  constructor(
    public state: AppState,
    private service: AppService,
    private route: ActivatedRoute) {}

  ngOnInit() {
//    console.log(this.route.snapshot.params);
//    if(this.route.snapshot.params['ctx']){
//      this.state.ctx = this.route.snapshot.params['ctx'];
//      this.service.getJournalConfig(this.state.ctx).subscribe();
//    }
    this.route.params
      .switchMap((params: Params) => Observable.of(params['ctx'])).subscribe(ctx => {
    console.log(ctx);
        if(ctx){
          this.state.ctx = ctx;
          this.service.getJournalConfig(ctx).subscribe();
        } else {
          this.state.ctx = "journal";
        }
//        if (this.state.config){
//          console.log(ctx);
//        } else {
//          console.log('noconfig');
//        }
      });
  }

}
