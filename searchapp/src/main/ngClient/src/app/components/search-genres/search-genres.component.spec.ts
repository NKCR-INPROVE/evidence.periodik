import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGenresComponent } from './search-genres.component';

describe('SearchGenresComponent', () => {
  let component: SearchGenresComponent;
  let fixture: ComponentFixture<SearchGenresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchGenresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGenresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
