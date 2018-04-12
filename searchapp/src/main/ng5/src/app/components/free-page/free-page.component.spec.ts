import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreePageComponent } from './free-page.component';

describe('FreePageComponent', () => {
  let component: FreePageComponent;
  let fixture: ComponentFixture<FreePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
