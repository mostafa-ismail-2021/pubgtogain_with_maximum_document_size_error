import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminduopubgComponent } from './adminduopubg.component';

describe('AdminduopubgComponent', () => {
  let component: AdminduopubgComponent;
  let fixture: ComponentFixture<AdminduopubgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminduopubgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminduopubgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
