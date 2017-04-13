import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalDetailsComponent } from './journal-details.component';

describe('JournalDetailsComponent', () => {
  let component: JournalDetailsComponent;
  let fixture: ComponentFixture<JournalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
