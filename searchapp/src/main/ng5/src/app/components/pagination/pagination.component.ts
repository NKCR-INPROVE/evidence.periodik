import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() numPages: number;
  @Input() totalPages: number;
  @Input() current: number = 0;
  @Output() onGotoPage: EventEmitter<number> = new EventEmitter<number>();
  
  pages: number[];
  

  constructor() { }

  ngOnInit() {
    this.setPages();
  }
  
  ngOnChanges(){
    this.setPages();
  }
  
  setPages(){
    this.pages = [];
    let pagesToShow = Math.min(this.numPages, this.totalPages);
    let min: number = Math.min(Math.max(0, this.current - Math.floor(pagesToShow / 2)), this.totalPages - pagesToShow);
    let max: number = min + pagesToShow;
    for(let i = min; i< max; i++){
      this.pages.push(i);
    }
  }
  
  prev(){
    this.current = Math.max(0, this.current - 1);
    this.setPages();
    this.onGotoPage.emit(this.current);
  }
  next(){
    this.current = Math.min(this.current + 1, this.totalPages);
    this.setPages();
    this.onGotoPage.emit(this.current);
  }
  gotoPage(p: number){
    this.current = p;
    this.setPages();
    this.onGotoPage.emit(this.current);
  }
  
  

}
