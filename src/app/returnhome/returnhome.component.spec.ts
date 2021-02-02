import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnhomeComponent } from './returnhome.component';

describe('ReturnhomeComponent', () => {
  let component: ReturnhomeComponent;
  let fixture: ComponentFixture<ReturnhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
