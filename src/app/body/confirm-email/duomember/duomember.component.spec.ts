import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuomemberComponent } from './duomember.component';

describe('DuomemberComponent', () => {
  let component: DuomemberComponent;
  let fixture: ComponentFixture<DuomemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuomemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuomemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
