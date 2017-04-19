import { Component, OnInit, Input } from '@angular/core';


import { AppService } from '../../services/app.service';
import { Journal } from '../../models/journal.model';


@Component({
  selector: 'app-journal-details',
  templateUrl: './journal-details.component.html',
  styleUrls: ['./journal-details.component.scss']
})
export class JournalDetailsComponent implements OnInit {

  @Input('journal') journal: Journal;
  year: string;
  volumeNumber: string;
  issueNumber: string;
  partName: string;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.details();

  }

  details() {
    if (this.journal.mods) {
      let mods = this.journal.mods["mods:modsCollection"]["mods:mods"];
      if (this.journal.model === 'periodicalvolume') {
        this.year = mods['mods:originInfo']['mods:dateIssued'];
        if (mods['mods:titleInfo']) {
          this.volumeNumber = mods['mods:titleInfo']['mods:partNumber'];
        }
      } else if (this.journal.model === 'periodicalitem') {
        this.year = mods['mods:originInfo']['mods:dateIssued'];
        if (mods['mods:titleInfo']) {
          this.issueNumber = mods['mods:titleInfo']['mods:partNumber'];
          this.partName = mods['mods:titleInfo']['mods:partName'];
        }
      }
    } else {
      this.appService.getMods(this.journal['pid']).subscribe(mods => {
        this.journal.mods = mods;
        this.details();
      });
    }
    //     Úroveň: Ročník
    //§  Rok: originInfo/dateIssued
    //§  Číslo ročníku: titleInfo/partNumber
    //o   Úroveň: Číslo
    //§  Číslo čísla: titleInfo/partNumber
    //Speciální název čísla: titleInfo/partName


  }

}
