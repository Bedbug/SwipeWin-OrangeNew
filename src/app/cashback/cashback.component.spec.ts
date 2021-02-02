import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackComponent } from './cashback.component';

describe('CashbackComponent', () => {
  let component: CashbackComponent;
  let fixture: ComponentFixture<CashbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
