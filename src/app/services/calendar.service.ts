import {Injectable} from "@angular/core";
import * as moment from "moment";
import {Moment} from "moment";
import * as _ from "lodash";
import {CalendarDay} from "../models/calendar-day";
import {CalendarType} from "../redux/actions/settings-actions";
import {NgRedux} from "ng2-redux";
import {RootState} from "../redux/store/index";
import {Observable} from "rxjs";
import {selectCalendarInfo, selectCalendarDate, selectSettingsType} from "../redux/store/selects";


@Injectable()
export class CalendarService {

  days: CalendarDay[] = [];
  // date$:Observable<Moment>;

  constructor(ngRedux: NgRedux<RootState>) {
    console.log(ngRedux);
    // ngRedux.select("cards").subscribe(
    //   cards => console.log(cards, "from store")
    // );


    ngRedux.select(selectCalendarInfo).subscribe(
      date => {
        console.log(date);
      }
    )

    // Observable.combineLatest(
    //   ngRedux.select(selectCalendarDate),
    //   ngRedux.select(selectSettingsType),
    // ).subscribe(x => console.log("x",x));

    /*
     *
     * also ich komme an die cards im service.
     *
     *
     * Was mache ich nun damit? Brainz...
     * Mappen im Stream. Das geht auch schon.
     *
     *
     * Grundgedanke war, ich wollte ströme durchreichen. Da bin ich aber nicht abhängig vom Service eigentlich. Sondern von der ID
     *
     *
     * */
    // console.log(ngRedux.getState());
    // console.log(22);
  }


  public days$: Observable<CalendarDay[]>;

  public next() {
    // -> next days
  }

  public previous() {
    // next das
  }

  // wird privat!
  public buildDays(date: Moment = moment()) {
    this.days = [
      ...this._buildBeforehandDaysMonth(date.clone()),
      ...this._buildRegularDaysMonth(date.clone()),
      ...this._buildAfterwardsDaysMonth(date.clone())
    ];
    return this.days;
  }

  public buildDaysSync(date: Moment = moment(), calendarType: CalendarType): CalendarDay[] {

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
          ...this._buildWeekDays(date.clone())
        ];
        break;
    }

    return days

  }


  // wird privat!
  public buildDaysAsync(date: Moment = moment(), calendarType: CalendarType): Promise<CalendarDay[]> {
    return new Promise((resolve, reject) => {

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
            ...this._buildWeekDays(date.clone())
          ];
          break;
      }

      resolve(days)

    })
  }

  private _buildRegularDaysMonth(date: Moment): CalendarDay[] {
    let days: CalendarDay[] = [];
    var monthDate = date.startOf('month'); // change to a date in the month of interest
    _.times(monthDate.daysInMonth(), n => {
      days.push(new CalendarDay(monthDate.toDate(), false, date.isSame(moment(), "day")));
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
    // date = date.add("month",1 ).toDate();   // Manipulate Date to test this function manually
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


  private _buildWeekDays(date: Moment): CalendarDay[] {
    let days: CalendarDay[] = [];
    date = moment(date).startOf('week');
    _.times(7, () => {
      days.push(new CalendarDay(date.toDate(), false, date.isSame(moment(), "day")));
      date.add(1, 'day');
    });
    return days;
  }


}
