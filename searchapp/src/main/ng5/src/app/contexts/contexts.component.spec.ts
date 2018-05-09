import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextsComponent } from './contexts.component';

describe('ContextsComponent', () => {
  let component: ContextsComponent;
  let fixture: ComponentFixture<ContextsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
