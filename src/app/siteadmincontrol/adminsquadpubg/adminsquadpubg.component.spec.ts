import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsquadpubgComponent } from './adminsquadpubg.component';

describe('AdminsquadpubgComponent', () => {
  let component: AdminsquadpubgComponent;
  let fixture: ComponentFixture<AdminsquadpubgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminsquadpubgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsquadpubgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
