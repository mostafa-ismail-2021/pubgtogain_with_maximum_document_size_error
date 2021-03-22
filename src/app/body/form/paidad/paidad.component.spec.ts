import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidadComponent } from './paidad.component';

describe('PaidadComponent', () => {
  let component: PaidadComponent;
  let fixture: ComponentFixture<PaidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
