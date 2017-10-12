import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {AppState} from '../../app.state';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
  private route: ActivatedRoute,
  private router: Router, 
    public state: AppState, 
    private service: AppService) { }

  ngOnInit() {
  }
  
  goHome(){
    this.state.filters = [];
    this.state.clear();
    if (this.route.snapshot.firstChild.url[0].path.indexOf('seznam-casopisu') > -1){
      this.service.getMagazines().subscribe();
    } else {
      setTimeout(() => {
        this.router.navigate(['/seznam-casopisu']);
      }, 100);
      
    }
    
  }

}
