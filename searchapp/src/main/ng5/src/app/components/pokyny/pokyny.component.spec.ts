import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokynyComponent } from './pokyny.component';

describe('PokynyComponent', () => {
  let component: PokynyComponent;
  let fixture: ComponentFixture<PokynyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PokynyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokynyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
