import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UniversalDayComponent} from './universal-day.component';

describe('UniversalDayComponent', () => {
  let component: UniversalDayComponent;
  let fixture: ComponentFixture<UniversalDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UniversalDayComponent]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversalDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
