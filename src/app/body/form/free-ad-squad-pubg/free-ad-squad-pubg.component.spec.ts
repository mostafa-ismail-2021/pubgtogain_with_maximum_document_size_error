import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeAdSquadPubgComponent } from './free-ad-squad-pubg.component';

describe('FreeAdSquadPubgComponent', () => {
  let component: FreeAdSquadPubgComponent;
  let fixture: ComponentFixture<FreeAdSquadPubgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeAdSquadPubgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeAdSquadPubgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
