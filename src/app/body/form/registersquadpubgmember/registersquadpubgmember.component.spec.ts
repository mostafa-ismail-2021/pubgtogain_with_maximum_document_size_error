import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersquadpubgmemberComponent } from './registersquadpubgmember.component';

describe('RegistersquadpubgmemberComponent', () => {
  let component: RegistersquadpubgmemberComponent;
  let fixture: ComponentFixture<RegistersquadpubgmemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistersquadpubgmemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistersquadpubgmemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
