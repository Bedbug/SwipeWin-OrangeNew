import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemogameComponent } from './demogame.component';

describe('DemogameComponent', () => {
  let component: DemogameComponent;
  let fixture: ComponentFixture<DemogameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemogameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemogameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
