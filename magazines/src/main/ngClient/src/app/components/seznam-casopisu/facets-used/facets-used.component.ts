import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facets-used',
  templateUrl: './facets-used.component.html',
  styleUrls: ['./facets-used.component.scss']
})
export class FacetsUsedComponent implements OnInit {
  
  // --- PRO TESTOVANI, POTOM VYMAZAT --- !!!!
  facetsUsed = [
    {id: 1, item: "dějiny knihoven"},
    {id: 2, item: "stát"}
  ]
  // --- PRO TESTOVANI, POTOM VYMAZAT --- !!!!

  constructor() { }

  ngOnInit() {
  }

}
