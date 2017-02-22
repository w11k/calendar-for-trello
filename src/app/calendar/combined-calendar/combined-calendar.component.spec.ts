/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {CombinedCalendarComponent} from './combined-calendar.component';

describe('CombinedCalendarComponent', () => {
  let component: CombinedCalendarComponent;
  let fixture: ComponentFixture<CombinedCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CombinedCalendarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinedCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
