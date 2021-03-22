import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadmemberComponent } from './squadmember.component';

describe('SquadmemberComponent', () => {
  let component: SquadmemberComponent;
  let fixture: ComponentFixture<SquadmemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquadmemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadmemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
