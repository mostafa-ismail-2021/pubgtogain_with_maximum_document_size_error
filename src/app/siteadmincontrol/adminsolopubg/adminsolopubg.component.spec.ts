import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsolopubgComponent } from './adminsolopubg.component';

describe('AdminsolopubgComponent', () => {
  let component: AdminsolopubgComponent;
  let fixture: ComponentFixture<AdminsolopubgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminsolopubgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsolopubgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
