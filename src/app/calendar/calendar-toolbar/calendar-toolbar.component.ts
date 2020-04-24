import {Component, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {combineLatest, Observable} from 'rxjs';
import {selectSettingsShowWeekend, selectSettingsType, selectSettingsWeekStart} from '../../redux/store/selects';
import {CalendarType, WeekStart} from '../../redux/actions/settings-actions';
import {untilComponentDestroyed} from 'ng2-rx-componentdestroyed';
import {times} from '../../shared/times';
import {addDays, getDate, getDay, isMonday, isSunday, isTuesday, isWednesday, isWeekend, startOfWeek} from 'date-fns';

@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
  styleUrls: ['./calendar-toolbar.component.scss']
})
export class CalendarToolbarComponent implements OnInit, OnDestroy {

  public headers: string[] = [];
  @select(selectSettingsType) public calendarType$: Observable<CalendarType>;
  @select(selectSettingsWeekStart) public weekStart$: Observable<WeekStart>;
  @select(selectSettingsShowWeekend) public showWeekend$: Observable<boolean>;

  constructor() {
  }

  ngOnInit() {
    combineLatest(this.calendarType$, this.weekStart$, this.showWeekend$)
      .pipe(untilComponentDestroyed(this))
      .subscribe(value => {
        this.headers = this.build(value[0], value[1], value[2]);
      });
  }

  ngOnDestroy() {
  }

  build(calendarType, weekStart: WeekStart, showWeekend: boolean): string[] {

    const weekStartsOn = weekStart === WeekStart.Monday ? 1 : 0;
    let date = startOfWeek(new Date(), {weekStartsOn: weekStartsOn});

    // const weekLength = calendarType === CalendarType.WorkWeek
    const weekLength = showWeekend
      ? 7
      : 5;

    const arr = [];
    times(weekLength, () => {
      arr.push(date);
      date = addDays(date, 1);
    });
    return arr;
  }
}
