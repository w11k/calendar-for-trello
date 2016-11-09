import {Component, OnInit} from '@angular/core';
import {Moment} from "moment";
import * as moment from "moment";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {CalendarActions, CalendarType, PeriodChange} from "../redux/actions/calendar-actions";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  calendarType: CalendarType;
  CalendarType = CalendarType;
  calendarDate: Moment; // todo remove
  @select(state => state.calendar.days) public calendar$: Observable<any>;
  @select(state => state.calendar.date) public calendarDate$: Observable<any>;
  @select(state => state.calendar.type) public calendarType$: Observable<any>;
  @select(state => state.settings.language) public language$: Observable<string>;
  public current: string;

  constructor(public calendarActions: CalendarActions) {
  }

  ngOnInit() {
    this.calendarDate$.subscribe(
      date => {
        this.calendarDate = date;
        this.current = this.determineCurrent(date, this.calendarType);
      }
    );
    this.calendarType$.subscribe(
      type => this.calendarType = type
    );
    this.language$.subscribe(lang => {
      if (this.calendarDate) {
        this.calendarDate = moment(this.calendarDate.format()).locale(lang || "en")
      }
      this.calendarActions.buildDays(this._returnCalDate(), this.calendarType)
    })

  }

  private _returnCalDate(): Moment {
    return typeof this.calendarDate ? this.calendarDate.clone() : moment()
  }


  public previous() {
    this.calendarActions.navigate(this._returnCalDate(), PeriodChange.subtract, this.calendarType);
  }

  public next() {
    this.calendarActions.navigate(this._returnCalDate(), PeriodChange.add, this.calendarType);
  }

  public toggleMode() {
    this.calendarActions.changeCalendarType();
    this.calendarActions.buildDays(moment(), this.calendarType);
  }

  public determineCurrent(date: Moment, type: CalendarType) {
    switch (type) {
      case CalendarType.Month:
        return date.format("MMMM,YYYY");
      case CalendarType.Week:
        return "KW" + date.format("W, MMMM YYYY");
    }
  }

  public toToday(): void {
    this.calendarActions.navigateToDate(moment(), this.calendarType);
  }
}
