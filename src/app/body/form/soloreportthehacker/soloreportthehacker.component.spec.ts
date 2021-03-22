import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloreportthehackerComponent } from './soloreportthehacker.component';

describe('SoloreportthehackerComponent', () => {
  let component: SoloreportthehackerComponent;
  let fixture: ComponentFixture<SoloreportthehackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoloreportthehackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoloreportthehackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
