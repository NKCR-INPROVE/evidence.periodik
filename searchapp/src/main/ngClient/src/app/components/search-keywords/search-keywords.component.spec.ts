import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchKeywordsComponent } from './search-keywords.component';

describe('SearchKeywordsComponent', () => {
  let component: SearchKeywordsComponent;
  let fixture: ComponentFixture<SearchKeywordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchKeywordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
