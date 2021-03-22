import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeAdConfirmEmailComponent } from './free-ad-confirm-email.component';

describe('FreeAdConfirmEmailComponent', () => {
  let component: FreeAdConfirmEmailComponent;
  let fixture: ComponentFixture<FreeAdConfirmEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeAdConfirmEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeAdConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
