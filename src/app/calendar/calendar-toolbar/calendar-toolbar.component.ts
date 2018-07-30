import {Component, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import * as _ from 'lodash';
import {selectSettingsLanguage, selectSettingsWeekStart} from '../../redux/store/selects';
import {WeekStart} from '../../redux/actions/settings-actions';
import {CalendarService} from '../../services/calendar.service';
import {componentDestroyed} from 'ng2-rx-componentdestroyed';
import {selectSettingsType} from '../../redux/store/selects';
import {selectSettingsWorkdays} from '../../redux/store/selects';
import {CalendarType} from "../../redux/actions/settings-actions";
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
  styleUrls: ['./calendar-toolbar.component.scss']
})
export class CalendarToolbarComponent implements OnInit, OnDestroy {

  public headers: string[] = [];
  private subscriptions: Subscription[] = [];
  @select(selectSettingsLanguage) public language$: Observable<string>;
  @select(selectSettingsWeekStart) public weekStart$: Observable<WeekStart>;
  @select(selectSettingsType) public calendarType$: Observable<CalendarType>;
  @select(selectSettingsWorkdays) public workdays$: Observable<number>;

  constructor(private calendarService: CalendarService) {
    // this.headers = this.build();
  }

  ngOnInit() {
      this.language$.combineLatest(this.weekStart$, this.calendarType$, this.workdays$)
        .takeUntil(componentDestroyed(this))
        .subscribe(value => {
          const lang = value[0];
          const weekStart: WeekStart = value[1];
          this.headers = this.build(weekStart, value[2], value[3]);
        });
  }

  ngOnDestroy() {
    // this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  build(weekStart: WeekStart, calendarType, workdays): string[] {

    let firstDayOfWeek = this.calendarService.getFirstDayOfWeek(moment(), weekStart);
    // convert to a new moment
    let date = moment(firstDayOfWeek);
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
