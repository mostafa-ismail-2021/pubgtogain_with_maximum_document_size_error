import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminpaidadsComponent } from './adminpaidads.component';

describe('AdminpaidadsComponent', () => {
  let component: AdminpaidadsComponent;
  let fixture: ComponentFixture<AdminpaidadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminpaidadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminpaidadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
