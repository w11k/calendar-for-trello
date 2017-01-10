/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {W11kInfoComponent} from './w11k-info.component';

describe('W11kInfoComponent', () => {
  let component: W11kInfoComponent;
  let fixture: ComponentFixture<W11kInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [W11kInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(W11kInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
