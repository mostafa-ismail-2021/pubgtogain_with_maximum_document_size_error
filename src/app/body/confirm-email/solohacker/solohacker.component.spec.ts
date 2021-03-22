import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolohackerComponent } from './solohacker.component';

describe('SolohackerComponent', () => {
  let component: SolohackerComponent;
  let fixture: ComponentFixture<SolohackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolohackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolohackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
