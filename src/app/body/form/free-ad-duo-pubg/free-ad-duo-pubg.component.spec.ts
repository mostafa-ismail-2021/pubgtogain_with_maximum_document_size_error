import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeAdDuoPubgComponent } from './free-ad-duo-pubg.component';

describe('FreeAdDuoPubgComponent', () => {
  let component: FreeAdDuoPubgComponent;
  let fixture: ComponentFixture<FreeAdDuoPubgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeAdDuoPubgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeAdDuoPubgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
