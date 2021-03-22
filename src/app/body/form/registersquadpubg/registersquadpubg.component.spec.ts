import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersquadpubgComponent } from './registersquadpubg.component';

describe('RegistersquadpubgComponent', () => {
  let component: RegistersquadpubgComponent;
  let fixture: ComponentFixture<RegistersquadpubgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistersquadpubgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistersquadpubgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
