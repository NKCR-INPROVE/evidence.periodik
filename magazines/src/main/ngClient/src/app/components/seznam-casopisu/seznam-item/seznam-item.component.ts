import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {AppState} from '../../../app.state';
import {AppService} from '../../../app.service';

@Component({
  selector: 'app-seznam-item',
  templateUrl: './seznam-item.component.html',
  styleUrls: ['./seznam-item.component.scss']
})
export class SeznamItemComponent implements OnInit {
  @Input() resultItem;
  
  showingDetail: boolean = false;
  
  constructor(
    private router: Router ,public state: AppState, private service: AppService) { }

  ngOnInit() {
  }
  
  
  addFilter(field: string, value: string){
    this.state.addFilter(field, value);
    this.router.navigate(['/seznam-casopisu']);
//    this.service.getMagazines().subscribe();
  }

  // toggle content function by id
  toggleDetail(id) {
    this.showingDetail = !this.showingDetail;
    $('#' + id + '-btn').toggleClass('active');
    $('#' + id).slideToggle("fast");
  }
}
