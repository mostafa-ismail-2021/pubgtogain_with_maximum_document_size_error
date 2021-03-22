import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadteamleaderComponent } from './squadteamleader.component';

describe('SquadteamleaderComponent', () => {
  let component: SquadteamleaderComponent;
  let fixture: ComponentFixture<SquadteamleaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquadteamleaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadteamleaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
