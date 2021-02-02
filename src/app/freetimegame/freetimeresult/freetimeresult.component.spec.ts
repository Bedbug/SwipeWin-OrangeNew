import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreetimeresultComponent } from './freetimeresult.component';

describe('FreetimeresultComponent', () => {
  let component: FreetimeresultComponent;
  let fixture: ComponentFixture<FreetimeresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreetimeresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreetimeresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
