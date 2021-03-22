import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteadmincontrolComponent } from './siteadmincontrol.component';

describe('SiteadmincontrolComponent', () => {
  let component: SiteadmincontrolComponent;
  let fixture: ComponentFixture<SiteadmincontrolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteadmincontrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteadmincontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
