import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.scss']
})
export class FacetsComponent implements OnInit {
  
  // --- PRO TESTOVANI, POTOM VYMAZAT --- !!!!
  facets = [
    {id: 1, title: "Přístup",
      items: [
        {item: "Open Access"},
        {item: "Omezeně / S embargem"}
      ]
    },
    {id: 2, title: "Oblast (sekce AV)",
      items: [
        {item: "Aplikovaná fyzika"},
        {item: "Matematika, fyzika a informatika"},
        {item: "Vědy o Zemi"},
        {item: "Chemické vědy"}
      ]
    },
    {id: 3, title: "Klíčová slova",
      items: [
        {item: "knihověda"},
        {item: "dějiny knihy"},
        {item: "dějiny knihtisku"},
      ]
    }
  ]
  // --- PRO TESTOVANI, POTOM VYMAZAT --- !!!!

  constructor() { }

  ngOnInit() {
  }

}
