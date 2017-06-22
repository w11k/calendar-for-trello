import {Injectable} from "@angular/core";
import * as moment from "moment";
import {Moment} from "moment";
import * as _ from "lodash";
import {CalendarDay} from "../models/calendar-day";
import {CalendarType} from "../redux/actions/settings-actions";
import {Observable, ReplaySubject} from "rxjs";
import {NgRedux} from "ng2-redux";
import {RootState} from "../redux/store/index";
import {
  selectCalendarDate,
  selectCardsByDate,
  selectSettingsLanguage,
  selectSettingsType
} from "../redux/store/selects";

@Injectable()
export class CalendarService {

  private static AGENDA_LENGTH = 4;
  public readonly days$: ReplaySubject<CalendarDay[]> = new ReplaySubject<CalendarDay[]>(1);

  constructor(private ngRedux: NgRedux<RootState>) {

    Observable.combineLatest(
      ngRedux.select(selectCalendarDate),
      ngRedux.select(selectSettingsType),
      ngRedux.select(selectCardsByDate),
      ngRedux.select(selectSettingsLanguage),
    ).subscribe(
      ([date, calendarType, cardsByDate, language]) => {
        let days = this.buildDaysSync(date, calendarType);
        days = days.map(day => {
          day.cards = cardsByDate[moment(day.date).format('YYYY-MM-DD')];
          return day;
        });
        this.days$.next(days);
      }
    );

  }


  public buildDaysSync(date: Moment, calendarType: CalendarType): CalendarDay[] {

    let days: CalendarDay[] = [];

    switch (calendarType) {
      case CalendarType.Month:
        days = [
          ...this._buildBeforehandDaysMonth(date.clone()),
          ...this._buildRegularDaysMonth(date.clone()),
          ...this._buildAfterwardsDaysMonth(date.clone())
        ];
        break;

      case CalendarType.Week:
        days = [
          ...this._buildAgendaDays(date, 7)
        ];
        break;

      case CalendarType.Agenda:
        days = [
          ...this._buildAgendaDays(date, CalendarService.AGENDA_LENGTH)
        ];
        break;
    }

    return days;

  }

  private _buildRegularDaysMonth(date: Moment): CalendarDay[] {
    let days: CalendarDay[] = [];
    let monthDate = date.startOf('month'); // change to a date in the month of interest
    _.times(monthDate.daysInMonth(), n => {
      days.push(new CalendarDay(monthDate.toDate(), false, date.isSame(moment(), 'day')));
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
  private _buildBeforehandDaysMonth(date: Moment): CalendarDay[] {
    // date = date.add('month',1 ).toDate();   // Manipulate Date to test this function manually
    let days: CalendarDay[] = [];
    let firstDay = date.startOf('month');
    let weekdayOfFirstDay = moment(firstDay).weekday();
    _.times(weekdayOfFirstDay, () => {
      firstDay.subtract(1, 'day');
      days.push(new CalendarDay(firstDay.toDate(), true));
    });
    return days.reverse();
  }

  // this will fill up the last calendar row with days from the last month
  // to do so, determine the first day of the month and its weekday number.
  private _buildAfterwardsDaysMonth(date: Moment): CalendarDay[] {
    let days: CalendarDay[] = [];
    let lastDay = date.endOf('month');
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


  private _buildAgendaDays(inDate: Moment, dayAmount: number): CalendarDay[] {
    let date = inDate.clone();
    let days: CalendarDay[] = [];

    _.times(dayAmount, () => {
      days.push(new CalendarDay(date.toDate(), false, date.isSame(moment(), 'day')));
      date.add(1, 'day');
    });

    return days;
  }


}
