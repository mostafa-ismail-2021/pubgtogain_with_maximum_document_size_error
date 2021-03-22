import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuopubgComponent } from './duopubg.component';

describe('DuopubgComponent', () => {
  let component: DuopubgComponent;
  let fixture: ComponentFixture<DuopubgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuopubgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuopubgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
