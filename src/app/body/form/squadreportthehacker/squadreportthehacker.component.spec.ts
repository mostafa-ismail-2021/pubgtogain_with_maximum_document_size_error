import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadreportthehackerComponent } from './squadreportthehacker.component';

describe('SquadreportthehackerComponent', () => {
  let component: SquadreportthehackerComponent;
  let fixture: ComponentFixture<SquadreportthehackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquadreportthehackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadreportthehackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
