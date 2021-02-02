import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultdemoComponent } from './resultdemo.component';

describe('ResultdemoComponent', () => {
  let component: ResultdemoComponent;
  let fixture: ComponentFixture<ResultdemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultdemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultdemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
