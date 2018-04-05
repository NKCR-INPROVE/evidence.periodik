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
      let mods = this.journal.mods;
      //console.log(mods);
      if (this.journal.model === 'periodicalvolume') {
        
        if(mods['mods:originInfo']){
          this.year = mods['mods:originInfo']['mods:dateIssued'];
          if (mods['mods:titleInfo']) {
            this.volumeNumber = mods['mods:titleInfo']['mods:partNumber'];
          }
        } else {
        //podpora pro starsi mods. ne podle zadani
        //
          //console.log(mods);
          if(mods['part'] && mods['part']['date']){
            this.year = mods['part']['date']; 
          } else if(mods['mods:part'] && mods['mods:part']['mods:date']){
            this.year = mods['mods:part']['mods:date']; 
          }
          
          if(mods['part'] && mods['part']['detail'] && mods['part']['detail']['number']){
            this.issueNumber = mods['part']['detail']['number']; 
          } else if(mods['mods:part'] && mods['mods:part']['mods:detail'] && mods['mods:part']['mods:detail']['mods:number']){
            this.issueNumber = mods['mods:part']['mods:detail']['mods:number']; 
          }
        }
      } else if (this.journal.model === 'periodicalitem') {
//        this.year = mods['mods:originInfo']['mods:dateIssued'];
//        if (mods['mods:titleInfo']) {
//          this.issueNumber = mods['mods:titleInfo']['mods:partNumber'];
//          this.partName = mods['mods:titleInfo']['mods:partName'];
//        }
        
        this.appService.getMods(this.journal.parent).subscribe(parentMods => {
          if(parentMods['mods:originInfo']){
          this.year = parentMods['mods:originInfo']['mods:dateIssued'];
          if (parentMods['mods:titleInfo']) {
            this.volumeNumber = parentMods['mods:titleInfo']['mods:partNumber'];
          }
        }
        });
        
        if (mods['mods:originInfo']) {
          //this.year = mods['mods:originInfo']['mods:dateIssued'];
          if (mods['mods:titleInfo']) {
            this.issueNumber = mods['mods:titleInfo']['mods:partNumber'];
            this.partName = mods['mods:titleInfo']['mods:partName'];
          }
        } else {
        
          //podpora pro starsi mods. ne podle zadani
          //
          //console.log(mods);
          if (mods['part'] && mods['part']['date']) {
            this.year = mods['part']['date'];
          } else if (mods['mods:part'] && mods['mods:part']['mods:date']) {
            this.year = mods['mods:part']['mods:date'];
          }

          if (mods['part'] && mods['part']['detail'] && mods['part']['detail']['number']) {
            this.issueNumber = mods['part']['detail']['number'];
          } else if (mods['mods:part'] && mods['mods:part']['mods:detail'] && mods['mods:part']['mods:detail']['mods:number']) {
            this.issueNumber = mods['mods:part']['mods:detail']['mods:number'];
          }
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
