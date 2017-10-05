import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VydavateleDetailComponent } from './vydavatele-detail.component';

describe('VydavateleDetailComponent', () => {
  let component: VydavateleDetailComponent;
  let fixture: ComponentFixture<VydavateleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VydavateleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VydavateleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
