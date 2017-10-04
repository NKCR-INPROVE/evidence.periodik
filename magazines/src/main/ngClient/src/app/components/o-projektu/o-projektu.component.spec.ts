import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OProjektuComponent } from './o-projektu.component';

describe('OProjektuComponent', () => {
  let component: OProjektuComponent;
  let fixture: ComponentFixture<OProjektuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OProjektuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OProjektuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
