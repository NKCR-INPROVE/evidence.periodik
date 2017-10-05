import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vydavatele',
  templateUrl: './vydavatele.component.html',
  styleUrls: ['./vydavatele.component.scss']
})
export class VydavateleComponent implements OnInit {
  
  // --- PRO TESTOVANI, POTOM VYMAZAT --- !!!!
  vydavatele = [
    {id: 1, title: "Ústavy AV ČR",
      items: [
        {name: "Archeologický ústav AV ČR, v. v. i., Brno"},
        {name: "Archeologický ústav AV ČR, v. v. i., Praha"},
        {name: "Etnologický ústav AV ČR, v. v. i."},
        {name: "Filosofický ústav AV ČR, v. v. i."},
        {name: "Fyziologický ústav AV ČR, v. v. i."},
        {name: "Knihovna Akademie věd ČR, v. v. i."},
        {name: "Matematický ústav AV ČR, v. v. i."},
        {name: "Sociologický ústav AV ČR, v. v. i."},
        {name: "Středisko společných činností AV ČR, v. v. i."}
      ]
    },
    {id: 2, title: "Vydavatelé mimo AV ČR",
      items: [
        {name: "Česká botanická společnost"},
        {name: "Filozofická fakulta, Masarykova univerzita"},
        {name: "Filozofická fakulta, Ostravská univerzita"},
        {name: "Sdružení pro inženýrskou mechaniku"},
        {name: "Vesmír, s. r. o."}
      ]
    }
  ]
  // --- PRO TESTOVANI, POTOM VYMAZAT --- !!!!

  constructor() { }

  ngOnInit() {
  }

}
