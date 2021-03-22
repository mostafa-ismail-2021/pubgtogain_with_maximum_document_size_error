import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterduopubgmemberComponent } from './registerduopubgmember.component';

describe('RegisterduopubgmemberComponent', () => {
  let component: RegisterduopubgmemberComponent;
  let fixture: ComponentFixture<RegisterduopubgmemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterduopubgmemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterduopubgmemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
