// Hint: Action is triggered by user interaction, network request, ...

import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {RootState} from '../store';
import {CalendarDay} from '../../models/calendar-day';
import {CalendarDaysService} from '../../services/calendar-days.service';
import {CalendarType} from './settings-actions';
import {addMonths, addWeeks, subMonths, subWeeks} from 'date-fns';

export enum PeriodChange {
  add, subtract
}

@Injectable()
export class CalendarActions {
  static BUILD_DAYS = 'BUILD_DAYS';
  static RESET_CALENDAR_STORE = 'RESET_CALENDAR_STORE';

  constructor(private ngRedux: NgRedux<RootState>,
              private calendarService: CalendarDaysService) {
  }

  public buildDays(date: Date, calendarType: CalendarType = CalendarType.Month) {
    this.calendarService.buildDaysAsync(date, calendarType)
      .then(days => {
        this.ngRedux.dispatch({type: CalendarActions.BUILD_DAYS, payload: days, date: date});
      })
    ;
  }


  public navigate(date: Date, change: PeriodChange, calendarType: CalendarType) {
    switch (calendarType) {
      case CalendarType.Month:
        switch (change) {
          case PeriodChange.add:
            date = addMonths(date, 1);
            break;
          case PeriodChange.subtract:
            date = subMonths(date, 1);
            break;
        }
        break;
      case CalendarType.Week:
      case CalendarType.WorkWeek:
        switch (change) {
          case PeriodChange.add:
            date = addWeeks(date, 1);
            break;
          case PeriodChange.subtract:
            date = subWeeks(date, 1);
            break;
        }
        break;
    }
    this.buildDays(date, calendarType);
  }

  // navigates to a date
  public navigateToDate(date: Date, calendarType: CalendarType) {
    this.buildDays(date, calendarType);

  }


  public resetStore() {
    this.ngRedux.dispatch({type: CalendarActions.RESET_CALENDAR_STORE});
  }


}
