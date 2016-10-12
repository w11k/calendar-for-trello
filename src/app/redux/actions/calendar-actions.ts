// Hint: Action is triggered by user interaction, network request, ...

import {Injectable} from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {RootState} from '../store';
import {CalendarDay} from "../../models/calendar-day";
import {CalendarService} from "../../services/calendar.service";
import {Moment} from "moment";

export enum PeriodChange {
  add, subtract
}
export enum CalendarType {
  Week, Month
}

@Injectable()
export class CalendarActions {
  constructor(private ngRedux: NgRedux<RootState>,
              private calendarService: CalendarService) {
  }

  static FILL_DAYS: string = 'FILL_DAYS';
  static BUILD_DAYS: string = 'BUILD_DAYS';
  static NAVIGATE: string = 'NAVIGATE';
  static CHANGE_TYPE: string = 'CHANGE_TYPE';

  public fillDays(days: CalendarDay) {
    this.ngRedux.dispatch({type: CalendarActions.FILL_DAYS, payload: days});
  };

  public buildDays(date: Moment, calendarType: CalendarType = CalendarType.Month) {
    this.calendarService.buildDaysAsync(date, calendarType)
      .then(days => {
        this.ngRedux.dispatch({type: CalendarActions.BUILD_DAYS, payload: days, date: date})
      })
    ;
  };

  public changeCalendarType() {
    this.ngRedux.dispatch({type: CalendarActions.CHANGE_TYPE})
  }


  public navigate(date: Moment, change: PeriodChange, calendarType: CalendarType) {
    switch (calendarType) {
      case CalendarType.Month:
        switch (change) {
          case PeriodChange.add:
            date.add(1, "months");
            break;
          case PeriodChange.subtract:
            date.subtract(1, "months");
            break;
        }
        break;
      case CalendarType.Week:
        switch (change) {
          case PeriodChange.add:
            date.add(1, "weeks");
            break;
          case PeriodChange.subtract:
            date.subtract(1, "weeks");
            break;
        }
        break;
    }
    this.buildDays(date, calendarType);
  };


}
