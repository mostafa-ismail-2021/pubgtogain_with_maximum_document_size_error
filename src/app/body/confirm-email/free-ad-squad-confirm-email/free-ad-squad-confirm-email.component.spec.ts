import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeAdSquadConfirmEmailComponent } from './free-ad-squad-confirm-email.component';

describe('FreeAdSquadConfirmEmailComponent', () => {
  let component: FreeAdSquadConfirmEmailComponent;
  let fixture: ComponentFixture<FreeAdSquadConfirmEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeAdSquadConfirmEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeAdSquadConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
