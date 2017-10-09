import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-seznam-item',
  templateUrl: './seznam-item.component.html',
  styleUrls: ['./seznam-item.component.scss']
})
export class SeznamItemComponent implements OnInit {
  @Input() resultItem;
  
  showingDetail: boolean = false;
  
  constructor() { }

  ngOnInit() {
  }

  // toggle content function by id
  toggleDetail(id) {
    this.showingDetail = !this.showingDetail;
    $('#' + id + '-btn').toggleClass('active');
    $('#' + id).slideToggle("fast");
  }
}
