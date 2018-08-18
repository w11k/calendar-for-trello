import {Component, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {selectSettingsType, selectSettingsWorkdays} from '../../redux/store/selects';
import {CalendarType} from '../../redux/actions/settings-actions';
import {CalendarService} from '../../services/calendar.service';
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
  private subscriptions: Subscription[] = [];
  @select(selectSettingsType) public calendarType$: Observable<CalendarType>;
  @select(selectSettingsWorkdays) public workdays$: Observable<number>;

  constructor(private calendarService: CalendarService) {
    // this.headers = this.build();
  }

  ngOnInit() {
    combineLatest(this.calendarType$, this.workdays$)
      .pipe(untilComponentDestroyed(this))
        .subscribe(value => {
          this.headers = this.build(value[0], value[1]);
        });
  }

  ngOnDestroy() {
    // this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  build(calendarType, workdays): string[] {


    // start with monday for CalendarType.WorkWeek.
    let date = calendarType === CalendarType.WorkWeek
      ? startOfWeek(new Date(), {weekStartsOn: 1})
      : startOfWeek(new Date());


    const weekLength = calendarType === CalendarType.WorkWeek
      ? 5
      : 7;

    const arr = [];
    times(weekLength, () => {
      arr.push(format(date, 'dddd'));
      date = addDays(date, 1);
    });
    return arr;
  }

}
