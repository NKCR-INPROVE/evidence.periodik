import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vydavatele-detail',
  templateUrl: './vydavatele-detail.component.html',
  styleUrls: ['./vydavatele-detail.component.scss']
})
export class VydavateleDetailComponent implements OnInit {
  
  showingDetail: boolean = false;
  
    // --- PRO TESTOVANI, POTOM VYMAZAT --- !!!!
  result = [
    {
      id: 1, 
      title: "Právník",
      img: "thumb-dejiny.png", 
      vydavatel: "Knihovna AV ČR, v. v. i.", 
      oblast: "Sociálně-ekonomické vědy", 
      ISSN: "1210-8510", 
      pristup: "Open Access", 
      kontakt: "kvo@knav.cz", 
      keywords: [
        {item: "knihověda"}, 
        {item: "dějiny knihy"},
        {item: "dějiny knihtisku"},
        {item: "dějiny knihoven"}
      ],
      desc: "Časopis je zaměřen na zveřejňování výsledků bádání v oblasti dějin knihy, knihtisku a knihoven v Čechách a na Moravě s časovým omezením do poloviny 19. století. Vedle pramenných a materiálových studií časopis uveřejňuje recenze a zprávy o domácí a zahraniční knihovědné produkci a informuje o konferencích a výstavách k dané tematice.",
      web: "http://www.incad.cz",
    },
    {
      id: 2,
      title: "Toto je test dlouhého titulku",
      img: "thumb-steve.png",
      vydavatel: "Knihovna AV ČR, v. v. i.", 
      oblast: "Sociálně-ekonomické vědy", 
      ISSN: "1210-8510", 
      pristup: "Open Access", 
      kontakt: "kvo@knav.cz", 
      keywords: [
        {item: "knihověda"}, 
        {item: "dějiny knihy"},
        {item: "dějiny knihtisku"},
        {item: "dějiny knihoven"}
      ],
      desc: "Časopis je zaměřen na zveřejňování výsledků bádání v oblasti dějin knihy, knihtisku a knihoven v Čechách a na Moravě s časovým omezením do poloviny 19. století. Vedle pramenných a materiálových studií časopis uveřejňuje recenze a zprávy o domácí a zahraniční knihovědné produkci a informuje o konferencích a výstavách k dané tematice.",
      web: "http://www.incad.cz",
    },
    {
      id: 3,
      title: "Věda a technika", 
      img: "thumb-adiktologie.png",
      vydavatel: "Knihovna AV ČR, v. v. i.", 
      oblast: "Sociálně-ekonomické vědy", 
      ISSN: "1210-8510", 
      pristup: "Open Access", 
      kontakt: "kvo@knav.cz", 
      keywords: [
        {item: "knihověda"}, 
        {item: "dějiny knihy"},
        {item: "dějiny knihtisku"},
        {item: "dějiny knihoven"}
      ],
      desc: "Časopis je zaměřen na zveřejňování výsledků bádání v oblasti dějin knihy, knihtisku a knihoven v Čechách a na Moravě s časovým omezením do poloviny 19. století. Vedle pramenných a materiálových studií časopis uveřejňuje recenze a zprávy o domácí a zahraniční knihovědné produkci a informuje o konferencích a výstavách k dané tematice.",
      web: "http://www.incad.cz"
    }
  ]
  // --- PRO TESTOVANI, POTOM VYMAZAT --- !!!!

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
