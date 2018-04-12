import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivItemLeftComponent } from './archiv-item-left.component';

describe('ArchivItemLeftComponent', () => {
  let component: ArchivItemLeftComponent;
  let fixture: ComponentFixture<ArchivItemLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivItemLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivItemLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
