import {Component, OnInit} from '@angular/core';
import {CardActions} from "../../redux/actions/card-actions";
import {Moment} from "moment";
import * as moment from "moment";
import {CalendarActions, PeriodChange, CalendarType} from "../../redux/actions/calendar-actions";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {CalendarUiDateFormat} from "../calendar-day/calendar-day.component";

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
  public current: string;

  constructor(public calendarActions: CalendarActions) {
    this.calendarActions.buildDays(moment());
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

  }


  public previous() {
    this.calendarActions.navigate(this.calendarDate.clone(), PeriodChange.subtract, this.calendarType);
  }

  public next() {
    this.calendarActions.navigate(this.calendarDate.clone(), PeriodChange.add, this.calendarType);
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
