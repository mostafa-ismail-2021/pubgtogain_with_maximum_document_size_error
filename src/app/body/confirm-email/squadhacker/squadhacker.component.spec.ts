import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadhackerComponent } from './squadhacker.component';

describe('SquadhackerComponent', () => {
  let component: SquadhackerComponent;
  let fixture: ComponentFixture<SquadhackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquadhackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadhackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
