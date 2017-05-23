import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() pages: number[];
  @Output() onGotoPage: EventEmitter<number> = new EventEmitter<number>();
  
  current: number = 0;
  

  constructor() { }

  ngOnInit() {
    console.log(this.pages);
  }
  
  prev(){
    this.current = Math.max(0, this.current - 1);
    this.onGotoPage.emit(this.current);
  }
  next(){
    this.current++;
    this.onGotoPage.emit(this.current);
  }
  gotoPage(p: number){
    this.current = p;
    this.onGotoPage.emit(this.current);
  }
  
  

}
