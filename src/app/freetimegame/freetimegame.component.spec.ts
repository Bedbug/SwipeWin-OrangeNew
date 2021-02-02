import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreetimegameComponent } from './freetimegame.component';

describe('FreetimegameComponent', () => {
  let component: FreetimegameComponent;
  let fixture: ComponentFixture<FreetimegameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreetimegameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreetimegameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
