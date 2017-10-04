import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeznamItemComponent } from './seznam-item.component';

describe('SeznamItemComponent', () => {
  let component: SeznamItemComponent;
  let fixture: ComponentFixture<SeznamItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeznamItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeznamItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
