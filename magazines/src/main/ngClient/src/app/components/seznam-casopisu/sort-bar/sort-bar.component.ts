import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../app.state';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-sort-bar',
  templateUrl: './sort-bar.component.html',
  styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent implements OnInit {

  constructor(public state: AppState, private service: AppService) { }

  ngOnInit() {
  }
  
  setSort(dir: string){
    this.state.currentSortDir = dir;
    this.service.getMagazines().subscribe();
  }

}
