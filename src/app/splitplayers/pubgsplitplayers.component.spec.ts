import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubgsplitplayersComponent } from './pubgsplitplayers.component';

describe('PubgsplitplayersComponent', () => {
  let component: PubgsplitplayersComponent;
  let fixture: ComponentFixture<PubgsplitplayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubgsplitplayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubgsplitplayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
