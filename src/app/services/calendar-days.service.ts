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
/*
    console.log(date);
    console.log(monthDate);
    console.log(getDaysInMonth(date));


 */
    times(getDaysInMonth(date), () => {
      const day = new Date(monthDate);
      // console.log(day);

      if ((showWeekend === true || !isWeekend(day)) ) {
        // console.log(`inside the if conditions of the smaller function`);
        days.push(new CalendarDay(day, false, isSameDay(monthDate, new Date())));
      }
      monthDate = addDays(monthDate, 1);
    });
    // console.log(monthDate);
    // console.log(days);
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
/*
    console.log(`firstDay: ${firstDay}`);
    console.log(`getDay of firstDay: ${getDay(firstDay)}`);
    console.log(`subtractDaysForStartDay: ${subtractDaysForStartDay}`);
    console.log(`weekdayOfFirstDay: ${weekdayOfFirstDay}`);


 */
    if (weekdayOfFirstDay < 0) {
      weekdayOfFirstDay = 6;
    }

    times(weekdayOfFirstDay, () => {
      firstDay = subDays(firstDay, 1);
      if (showWeekend === true || !isWeekend(firstDay)) {
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
    const runs = 6 - weekdayOfLastDay;
    times(runs, () => {
      // its weird, that this add day is before the push. error potential.
      lastDay = addDays(lastDay, 1);
      if (showWeekend === true || !isWeekend(lastDay)) {
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
