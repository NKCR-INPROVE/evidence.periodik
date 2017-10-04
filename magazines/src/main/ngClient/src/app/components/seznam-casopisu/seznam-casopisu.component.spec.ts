import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeznamCasopisuComponent } from './seznam-casopisu.component';

describe('SeznamCasopisuComponent', () => {
  let component: SeznamCasopisuComponent;
  let fixture: ComponentFixture<SeznamCasopisuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeznamCasopisuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeznamCasopisuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
