import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterduopubgComponent } from './registerduopubg.component';

describe('RegisterduopubgComponent', () => {
  let component: RegisterduopubgComponent;
  let fixture: ComponentFixture<RegisterduopubgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterduopubgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterduopubgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
