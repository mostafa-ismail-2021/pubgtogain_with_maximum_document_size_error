import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuohackerComponent } from './duohacker.component';

describe('DuohackerComponent', () => {
  let component: DuohackerComponent;
  let fixture: ComponentFixture<DuohackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuohackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuohackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
