import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  private route: ActivatedRoute,
    private router: Router, 
    public state: AppState, 
    private service: AppService) { }

  ngOnInit() {
  }
  
  
  addFilter(field: string, value: string){
    if (!this.state.isFacetUsed(field, value)){
      this.state.addFilter(field, value);
      if (this.route.snapshot.url[0].path.indexOf('seznam-casopisu') > -1){
        this.service.getMagazines().subscribe();
      } else {
        this.router.navigate(['/seznam-casopisu']);
      }
    }
  }

  // toggle content function by id
  toggleDetail(id) {
    this.showingDetail = !this.showingDetail;
    $('#' + id + '-btn').toggleClass('active');
    $('#' + id).slideToggle("fast");
  }
}
