import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuoteamleaderComponent } from './duoteamleader.component';

describe('DuoteamleaderComponent', () => {
  let component: DuoteamleaderComponent;
  let fixture: ComponentFixture<DuoteamleaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuoteamleaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuoteamleaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
