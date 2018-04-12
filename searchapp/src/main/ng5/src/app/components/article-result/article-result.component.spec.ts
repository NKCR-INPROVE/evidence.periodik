import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleResultComponent } from './article-result.component';

describe('ArticleResultComponent', () => {
  let component: ArticleResultComponent;
  let fixture: ComponentFixture<ArticleResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
