import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import * as _ from 'lodash';
import {CalendarDay} from '../models/calendar-day';
import {CalendarType, WeekStart} from '../redux/actions/settings-actions';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs/Rx';
import {selectSettingsWeekStart} from '../redux/store/selects';


@Injectable()
export class CalendarService {

  @select(selectSettingsWeekStart) public weekStart$: Observable<WeekStart>;

  public buildDaysAsync(date: Moment = moment(), calendarType: CalendarType, weekdays: number): Promise<CalendarDay[]> {
    return new Promise((resolve, reject) => {

      let days: CalendarDay[] = [];

      this.weekStart$.subscribe(weekStart => {

        switch (calendarType) {
          case CalendarType.Month:
            days = [
              ...this._buildBeforehandDaysMonth(date.clone(), weekStart),
              ...this._buildRegularDaysMonth(date.clone(), weekStart),
              ...this._buildAfterwardsDaysMonth(date.clone(), weekStart)
            ];
            break;
          case CalendarType.Week:
            days = [
              ...this._buildWeekDays(date.clone(), weekStart, 7)
            ];
            break;
          case CalendarType.WorkWeek:
            console.log('weekdays', weekdays);
            days = [
              ...this._buildWeekDays(date.clone(), weekStart, weekdays)
            ];
            break;
        }

        console.log(days);
        resolve(days);
      });

    });
  }

  private _buildRegularDaysMonth(date: moment.Moment, weekStart: WeekStart): CalendarDay[] {
    let days: CalendarDay[] = [];
    let monthDate = this.getFirstDayOfMonth(date, weekStart); // change to a date in the month of interest
    _.times(monthDate.daysInMonth(), n => {
      days.push(new CalendarDay(monthDate.toDate(), false, monthDate.isSame(moment(), 'day')));
      monthDate.add(1, 'day');
    });
    return days;
  }


  /**
   * Watch out:
   *
   * While moment().weekday() starts with 0,
   * moment().isoWeekday() starts with 1
   * */

  // this will fill up the first calendar row with days from the last month
  // to do so, determine the first day of the month and its weekday number.
  private _buildBeforehandDaysMonth(date: moment.Moment, weekStart: WeekStart): CalendarDay[] {
    // date = date.add("month",1 ).toDate();   // Manipulate Date to test this function manually
    let days: CalendarDay[] = [];
    let firstDay = this.getFirstDayOfMonth(date, weekStart);
    let weekdayOfFirstDay = moment(firstDay).weekday();
    _.times(weekdayOfFirstDay, () => {
      firstDay.subtract(1, 'day');
      days.push(new CalendarDay(firstDay.toDate(), true));
    });
    return days.reverse();
  }

  // this will fill up the last calendar row with days from the last month
  // to do so, determine the first day of the month and its weekday number.
  private _buildAfterwardsDaysMonth(date: moment.Moment, weekStart: WeekStart): CalendarDay[] {
    let days: CalendarDay[] = [];
    let lastDay = this.getLastDayOfMonth(date, weekStart);
    let weekdayOfLastDay = moment(lastDay).weekday();
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
    _.times(runs, () => {
      lastDay.add(1, 'day');
      days.push(new CalendarDay(lastDay.toDate(), true));
    });
    return days;
  }

  private getFirstDayOfMonth(date: moment.Moment, weekStart: WeekStart) {
    let localLang = this.getLocalForCalculation(date, weekStart);
    let firstDay = localLang.startOf('month');
    return firstDay;
  }
  private getLastDayOfMonth(date: moment.Moment, weekStart: WeekStart) {
    let localLang = this.getLocalForCalculation(date, weekStart);
    let firstDay = localLang.endOf('month');
    return firstDay;
  }
  public getFirstDayOfWeek(date: moment.Moment, weekStart: WeekStart): Date {
    let localLang = this.getLocalForCalculation(date, weekStart);
    let firstDay = localLang.startOf('week');
    return firstDay.toDate();
  }

  private getLocalForCalculation(date: moment.Moment, weekStart: WeekStart) {
    // Create moment object
    const localLang = moment(date);
    // Retrieve first day of the week and format it
    if (weekStart === WeekStart.Monday) {
      localLang.locale('de');
      // console.log('monday');
    } else if (weekStart === WeekStart.Sunday) {
      localLang.locale('en');
      // console.log('sunday');
    }

    return localLang;
  }

  private _buildWeekDays(date: moment.Moment, weekStart: WeekStart, weekdays: number): CalendarDay[] {
    let days: CalendarDay[] = [];
    const firstDay = this.getFirstDayOfWeek(date, weekStart);
    let day = moment(firstDay);

    _.times(7, () => {
      let dayOfWeek = moment(day.toDate()).isoWeekday();
      if (dayOfWeek <= weekdays) {
        days.push(new CalendarDay(day.toDate(), false, day.isSame(moment(), 'day')));
      }
      day.add(1, 'day');
    });
    return days;
  }
}
