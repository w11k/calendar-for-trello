import {Injectable} from '@angular/core';
import {CalendarDay} from '../models/calendar-day';
import {CalendarType} from '../redux/actions/settings-actions';
import {times} from '../shared/times';
import {
  addDays,
  getDay,
  getDaysInMonth,
  isSameDay,
  lastDayOfMonth,
  startOfISOWeek,
  startOfMonth,
  subDays
} from 'date-fns';


@Injectable()
export class CalendarService {

  public buildDaysAsync(date: Date = new Date(), calendarType: CalendarType, weekdays: number): Promise<CalendarDay[]> {
    return new Promise((resolve, reject) => {

      let days: CalendarDay[] = [];

        switch (calendarType) {
          case CalendarType.Month:
            days = [
              ...this._buildBeforehandDaysMonth(date),
              ...this._buildRegularDaysMonth(date),
              ...this._buildAfterwardsDaysMonth(date)
            ];
            break;
          case CalendarType.Week:
            days = [
              ...this._buildWeekDays(date, 7)
            ];
            break;
          case CalendarType.WorkWeek:
            days = [
              ...this._buildWeekDays(date, weekdays)
            ];
            break;
        }

        resolve(days);

    });
  }

  private _buildRegularDaysMonth(date: Date): CalendarDay[] {
    let days: CalendarDay[] = [];
    let monthDate = startOfMonth(date); // change to a date in the month of interest
    times(getDaysInMonth(date), n => {
      days.push(new CalendarDay(new Date(monthDate), false, isSameDay(monthDate, new Date())));
      monthDate = addDays(monthDate, 1);
    });
    return days;
  }

  // this will fill up the first calendar row with days from the last month
  // to do so, determine the first day of the month and its weekday number.
  private _buildBeforehandDaysMonth(date: Date): CalendarDay[] {
    // date = date.add("month",1 ).toDate();   // Manipulate Date to test this function manually
    const days: CalendarDay[] = [];
    let firstDay = startOfMonth(date);
    const weekdayOfFirstDay = getDay(firstDay);
    times(weekdayOfFirstDay, () => {
      firstDay = subDays(firstDay, 1);
      days.push(new CalendarDay(firstDay, true));
    });
    return days.reverse();
  }

  // to do so, determine the first day of the month and its weekday number.
  private _buildAfterwardsDaysMonth(date: Date): CalendarDay[] {
    const days: CalendarDay[] = [];
    let lastDay = lastDayOfMonth(date);
    let weekdayOfLastDay = getDay(lastDay);
    let runs;
    switch (weekdayOfLastDay) {
      case 0:
        runs = 6;
        break;
      case 1:
        runs = 5;
        break;
      case 2:
        runs = 4;
        break;
      case 3:
        runs = 3;
        break;
      case 4:
        runs = 2;
        break;
      case 5:
        runs = 1;
        break;
      case 6:
        runs = 0;
        break;
    }
    times(runs, () => {
      // its weird, that this add day is before the push. error potential.
      lastDay = addDays(lastDay, 1);
      days.push(new CalendarDay(lastDay, true));
    });
    return days;
  }

  private _buildWeekDays(date: Date, weekdays: number): CalendarDay[] {
    let days: CalendarDay[] = [];
    const firstDay = startOfISOWeek(date);
    let day = new Date(firstDay);

    times(weekdays, () => {
      const dayOfWeek = getDay(day);
      days.push(new CalendarDay(day, false, isSameDay(date, new Date())));
      day = addDays(day, 1);
    });
    return days;
  }
}
