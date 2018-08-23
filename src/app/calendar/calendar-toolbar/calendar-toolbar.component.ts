import {Component, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {combineLatest, Observable} from 'rxjs';
import {selectSettingsType, selectSettingsWeekStart, selectSettingsWorkdays} from '../../redux/store/selects';
import {CalendarType, WeekStart} from '../../redux/actions/settings-actions';
import {untilComponentDestroyed} from 'ng2-rx-componentdestroyed';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/takeUntil';
import {times} from '../../shared/times';
import {addDays, format, startOfWeek} from 'date-fns';

@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
  styleUrls: ['./calendar-toolbar.component.scss']
})
export class CalendarToolbarComponent implements OnInit, OnDestroy {

  public headers: string[] = [];
  @select(selectSettingsType) public calendarType$: Observable<CalendarType>;
  @select(selectSettingsWorkdays) public workdays$: Observable<number>;
  @select(selectSettingsWeekStart) public weekStart$: Observable<WeekStart>;

  constructor() {
  }

  ngOnInit() {
    combineLatest(this.calendarType$, this.workdays$, this.weekStart$)
      .pipe(untilComponentDestroyed(this))
        .subscribe(value => {
          this.headers = this.build(value[0], value[1], value[2]);
        });
  }

  ngOnDestroy() {
  }

  build(calendarType, workdays, weekStart: WeekStart): string[] {

      const weekStartsOn = weekStart === WeekStart.Monday ? 1 : 0;
      let date = startOfWeek(new Date(), {weekStartsOn: weekStartsOn});

      const weekLength = calendarType === CalendarType.WorkWeek
        ? workdays
        : 7;

      const arr = [];
      times(weekLength, () => {
        arr.push(format(date, 'dddd'));
        date = addDays(date, 1);
      });
      return arr;
  }
}
