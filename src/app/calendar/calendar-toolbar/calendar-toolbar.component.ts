import {Component, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import * as _ from 'lodash';
import {selectSettingsLanguage} from '../../redux/store/selects';
import {selectSettingsType} from '../../redux/store/selects';
import {selectSettingsWorkdays} from '../../redux/store/selects';
import {CalendarType} from "../../redux/actions/settings-actions";

@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
  styleUrls: ['./calendar-toolbar.component.scss']
})
export class CalendarToolbarComponent implements OnInit, OnDestroy {

  public headers: string[] = [];
  private subscriptions: Subscription[] = [];
  @select(selectSettingsLanguage) public language$: Observable<string>;
  @select(selectSettingsType) public calendarType$: Observable<CalendarType>;
  @select(selectSettingsWorkdays) public workdays$: Observable<number>;

  constructor() {
  }

  ngOnInit() {
    this.subscriptions.push(
      Observable
        .combineLatest(this.language$, this.calendarType$, this.workdays$)
        .subscribe(x => {
          this.headers = this.build(x[1], x[2]);
        }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  build(calendarType, workdays): string[] {
    let date = moment().startOf('week');
    let arr = [];
    _.times(7, () => {
      let dayOfWeek = moment(date).isoWeekday();
      if (calendarType != CalendarType.WorkWeek || dayOfWeek <= workdays) {
        arr.push(date.format('dddd'));
      }
      date.add(1, 'days');
    });
    return arr;
  }

}
