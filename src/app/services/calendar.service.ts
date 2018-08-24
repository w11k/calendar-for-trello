import {Injectable} from '@angular/core';
import {CalendarDay} from '../models/calendar-day';
import {CalendarType, WeekStart} from '../redux/actions/settings-actions';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {selectSettingsWeekStart} from '../redux/store/selects';
import {times} from '../shared/times';
import {addDays, getDay, getDaysInMonth, isSameDay, lastDayOfMonth, startOfMonth, startOfWeek, subDays} from 'date-fns';


@Injectable()
export class CalendarService {

  public buildDaysAsync(date: Date = new Date(), calendarType: CalendarType, weekdays: number): Promise<CalendarDay[]> {
    return new Promise((resolve) => {

      let days: CalendarDay[] = [];

      this.weekStart$.subscribe(weekStart => {

        const startWithMonday = weekStart === WeekStart.Monday;

        switch (calendarType) {
          case CalendarType.Month:
            days = [
              ...this._buildBeforehandDaysMonth(date, startWithMonday),
              ...this._buildRegularDaysMonth(date),
              ...this._buildAfterwardsDaysMonth(date, startWithMonday)
            ];
            break;
          case CalendarType.Week:
            days = [
              ...this._buildWeekDays(date, 7, startWithMonday)
            ];
            break;
          case CalendarType.WorkWeek:
            days = [
              ...this._buildWeekDays(date, weekdays, startWithMonday)
            ];
            break;
        }

        resolve(days);
      });

    });
  }

  private _buildRegularDaysMonth(date: Date): CalendarDay[] {
    const days: CalendarDay[] = [];
    let monthDate = startOfMonth(date); // change to a date in the month of interest
    times(getDaysInMonth(date), () => {
      days.push(new CalendarDay(new Date(monthDate), false, isSameDay(monthDate, new Date())));
      monthDate = addDays(monthDate, 1);
    });
    return days;
  }

  // this will fill up the first calendar row with days from the last month
  // to do so, determine the first day of the month and its weekday number.
  private _buildBeforehandDaysMonth(date: Date, startWithMonday: boolean): CalendarDay[] {
    // date = date.add("month",1 ).toDate();   // Manipulate Date to test this function manually
    const days: CalendarDay[] = [];
    let firstDay = startOfMonth(date);
    const subtractDaysForStartDay = startWithMonday ? 1 : 0;
    const weekdayOfFirstDay = getDay(firstDay) - subtractDaysForStartDay;
    times(weekdayOfFirstDay, () => {
      firstDay = subDays(firstDay, 1);
      days.push(new CalendarDay(firstDay, true));
    });
    return days.reverse();
  }

  // to do so, determine the first day of the month and its weekday number.
  private _buildAfterwardsDaysMonth(date: Date, startWithMonday: boolean): CalendarDay[] {
    const days: CalendarDay[] = [];
    let lastDay = lastDayOfMonth(date);
    const subtractDaysForStartDay = startWithMonday ? 1 : 0;
    const weekdayOfLastDay = getDay(lastDay) - subtractDaysForStartDay;
    const runs = 6 - weekdayOfLastDay;
    times(runs, () => {
      // its weird, that this add day is before the push. error potential.
      lastDay = addDays(lastDay, 1);
      days.push(new CalendarDay(lastDay, true));
    });
    return days;
  }

  private _buildWeekDays(date: Date, weekdays: number, startWithMonday: boolean): CalendarDay[] {
    const days: CalendarDay[] = [];
    const weekStartsOn = startWithMonday ? 1 : 0;
    const firstDay = startOfWeek(date, {weekStartsOn: weekStartsOn});
    let day = new Date(firstDay);

    times(weekdays, () => {
      days.push(new CalendarDay(day, false, isSameDay(date, new Date())));
      day = addDays(day, 1);
    });
    return days;
  }
}
