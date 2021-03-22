import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeAdDuoConfirmEmailComponent } from './free-ad-duo-confirm-email.component';

describe('FreeAdDuoConfirmEmailComponent', () => {
  let component: FreeAdDuoConfirmEmailComponent;
  let fixture: ComponentFixture<FreeAdDuoConfirmEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeAdDuoConfirmEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeAdDuoConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
