import {Injectable} from '@angular/core';
import {CalendarDay} from '../models/calendar-day';
import {CalendarType, WeekStart} from '../redux/actions/settings-actions';
import {select} from '@angular-redux/store';
import {combineLatest, Observable} from 'rxjs';
import {selectSettingsShowWeekend, selectSettingsWeekStart} from '../redux/store/selects';
import {times} from '../shared/times';
import {
  addDays,
  getDay,
  getDaysInMonth, isFriday,
  isSameDay, isSaturday, isSunday,
  isWeekend,
  lastDayOfMonth,
  startOfMonth,
  startOfWeek,
  subDays
} from 'date-fns';
import {take} from 'rxjs/operators';

@Injectable()
export class CalendarDaysService {

  @select(selectSettingsWeekStart) public weekStart$: Observable<WeekStart>;
  @select(selectSettingsShowWeekend) public showWeekend$: Observable<boolean>;

  public buildDaysAsync(date: Date = new Date(), calendarType: CalendarType): Promise<CalendarDay[]> {
    return new Promise((resolve) => {

      let days: CalendarDay[] = [];

      combineLatest(this.weekStart$, this.showWeekend$).pipe(
        take(1)
      )
        .subscribe(x => {

          const weekStart = x[0];
          const showWeekend = x[1];
          const startWithMonday = weekStart === WeekStart.Monday;

          switch (calendarType) {
            case CalendarType.Month:
              days = [
                ...this._buildBeforehandDaysMonth(date, startWithMonday, showWeekend),
                ...this._buildRegularDaysMonth(date, startWithMonday, showWeekend),
                ...this._buildAfterwardsDaysMonth(date, startWithMonday, showWeekend)
              ];
              break;
            case CalendarType.Week:
              days = [
                ...this._buildWeekDays(date, startWithMonday, showWeekend)
              ];
              break;
            case CalendarType.WorkWeek:
              days = [
                ...this._buildWeekDays(date, startWithMonday, showWeekend)
              ];
              break;
          }

          resolve(days);
        });

    });
  }

  private _buildRegularDaysMonth(date: Date, startWithMonday: boolean, showWeekend: boolean): CalendarDay[] {
    const days: CalendarDay[] = [];
    let monthDate = startOfMonth(date); // change to a date in the month of interest

    times(getDaysInMonth(date), () => {
      const day = new Date(monthDate);

      if (startWithMonday === false) {
        if (showWeekend === true || (!isFriday(day) && !isSaturday(day))) {
          days.push(new CalendarDay(day, false, isSameDay(monthDate, new Date())));
        }
      } else if ((showWeekend === true || !isWeekend(day)) ) {
        days.push(new CalendarDay(day, false, isSameDay(monthDate, new Date())));
      }
      monthDate = addDays(monthDate, 1);
    });
    return days;
  }

  // this will fill up the first calendar row with days from the last month
  // to do so, determine the first day of the month and its weekday number.
  private _buildBeforehandDaysMonth(date: Date, startWithMonday: boolean, showWeekend: boolean): CalendarDay[] {
    // date = date.add("month",1 ).toDate();   // Manipulate Date to test this function manually
    const days: CalendarDay[] = [];
    let firstDay = startOfMonth(date);
    const subtractDaysForStartDay = startWithMonday ? 1 : 0;
    let weekdayOfFirstDay = getDay(firstDay) - subtractDaysForStartDay;

    if (weekdayOfFirstDay < 0) {
      weekdayOfFirstDay = 6;
    }

    times(weekdayOfFirstDay, () => {
      firstDay = subDays(firstDay, 1);

      if (startWithMonday === false) {
        if (showWeekend === true || (!isFriday(firstDay) && !isSaturday(firstDay))) {
          days.push(new CalendarDay(firstDay, true));
        }
      } else if (showWeekend === true || !isWeekend(firstDay)) {
        days.push(new CalendarDay(firstDay, true));
      }
    });
    return days.reverse();
  }

  // to do so, determine the first day of the month and its weekday number.
  private _buildAfterwardsDaysMonth(date: Date, startWithMonday: boolean, showWeekend: boolean): CalendarDay[] {
    const days: CalendarDay[] = [];
    let lastDay = lastDayOfMonth(date);
    const subtractDaysForStartDay = startWithMonday ? 1 : 0;
    const weekdayOfLastDay = getDay(lastDay) - subtractDaysForStartDay;
    let runs = 6 - weekdayOfLastDay;

    if (weekdayOfLastDay < 0) {
      runs = 0;
    }

    times(runs, () => {
      // its weird, that this add day is before the push. error potential.
      lastDay = addDays(lastDay, 1);

      if (startWithMonday === false) {
        if (showWeekend === true || (!isFriday(lastDay) && !isSaturday(lastDay))) {
          days.push(new CalendarDay(lastDay, true));
        }
      } else if (showWeekend === true || !isWeekend(lastDay)) {
        days.push(new CalendarDay(lastDay, true));
      }
    });
    return days;
  }

  private _buildWeekDays(date: Date, startWithMonday: boolean, showWeekend: boolean): CalendarDay[] {
    const days: CalendarDay[] = [];
    const weekStartsOn = startWithMonday ? 1 : 0;
    const firstDay = startOfWeek(date, {weekStartsOn: weekStartsOn});
    let day = new Date(firstDay);
    const amountDays = showWeekend ? 7 : 5;

    times(amountDays, () => {
      days.push(new CalendarDay(day, false, isSameDay(date, new Date())));
      day = addDays(day, 1);
    });
    return days;
  }
}
