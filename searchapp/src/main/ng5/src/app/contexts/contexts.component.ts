import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {AppState} from 'app/app.state';
import {AppService} from 'app/services/app.service';

@Component({
  selector: 'app-contexts',
  templateUrl: './contexts.component.html',
  styleUrls: ['./contexts.component.scss']
})
export class ContextsComponent implements OnInit {
  
  subscription;

  constructor(
    public state: AppState,
    private service: AppService,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => Observable.of(params['ctx'])).subscribe(ctx => {
console.log(this.state.config, ctx);
        if (ctx) {
          
          this.service.getJournals().subscribe(res => {
            this.service.setStyles();
            if (this.state.config) {
              this.setCtx(this.service.getCtx(ctx), false);
            } else {
              this.subscription = this.state.stateChangedSubject.subscribe(cf => {
                
                this.setCtx(this.service.getCtx(ctx), false);
                this.subscription.unsubscribe();
              });
            }
          });
        } else {
          if (this.state.config) {
            this.setCtx(this.state.config['defCtx'], true);
          } else {
            this.subscription = this.state.stateChangedSubject.subscribe(cf => {
              this.setCtx(this.state.config['defCtx'], true);
    this.subscription.unsubscribe();
            });
          }
        }
      });
  }

  setCtx(ctx, navigate: boolean) {
    console.log(this.state.ctxs, ctx);
    this.state.ctx = ctx;
    this.service.getJournalConfig(this.state.ctx).subscribe(res => {
      if(navigate){
        this.router.navigate([this.state.ctx.ctx, 'home']);
      }
    });
  }
  

}
