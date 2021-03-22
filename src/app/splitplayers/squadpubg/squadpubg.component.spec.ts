import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadpubgComponent } from './squadpubg.component';

describe('SquadpubgComponent', () => {
  let component: SquadpubgComponent;
  let fixture: ComponentFixture<SquadpubgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquadpubgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadpubgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
