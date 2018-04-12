import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.state';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public state: AppState) { }

  ngOnInit() {
  }

}
