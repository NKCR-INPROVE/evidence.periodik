import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OCasopisuComponent } from './o-casopisu.component';

describe('OCasopisuComponent', () => {
  let component: OCasopisuComponent;
  let fixture: ComponentFixture<OCasopisuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OCasopisuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OCasopisuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
