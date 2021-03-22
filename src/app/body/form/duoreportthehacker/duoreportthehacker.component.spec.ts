import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuoreportthehackerComponent } from './duoreportthehacker.component';

describe('DuoreportthehackerComponent', () => {
  let component: DuoreportthehackerComponent;
  let fixture: ComponentFixture<DuoreportthehackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuoreportthehackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuoreportthehackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
