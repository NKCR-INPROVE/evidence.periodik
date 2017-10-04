import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VydavateleComponent } from './vydavatele.component';

describe('VydavateleComponent', () => {
  let component: VydavateleComponent;
  let fixture: ComponentFixture<VydavateleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VydavateleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VydavateleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
