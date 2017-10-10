import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { AppState } from '../../../app.state';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-vydavatele-detail',
  templateUrl: './vydavatele-detail.component.html',
  styleUrls: ['./vydavatele-detail.component.scss']
})
export class VydavateleDetailComponent implements OnInit {
  
  showingDetail: boolean = false;
  editor: any;

  constructor(
    private route: ActivatedRoute,
    public state: AppState,
    private service: AppService
  ) {
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.editor = this.state.editorsbyId[id];
    this.service.getEditorMagazines(id).subscribe(res => {});
  }

  // toggle content function by id
  toggleDetail(id) {
    this.showingDetail = !this.showingDetail;
    $('#' + id + '-btn').toggleClass('active');
    $('#' + id).slideToggle("fast");
  }
}
