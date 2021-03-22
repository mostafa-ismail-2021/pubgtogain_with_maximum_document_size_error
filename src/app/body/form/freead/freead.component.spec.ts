import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeadComponent } from './freead.component';

describe('FreeadComponent', () => {
  let component: FreeadComponent;
  let fixture: ComponentFixture<FreeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
