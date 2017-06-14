import {Component, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {select} from 'ng2-redux';
import {Observable, Subscription} from 'rxjs';
import * as _ from 'lodash';
import {selectSettingsLanguage} from '../../redux/store/selects';

@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
  styleUrls: ['./calendar-toolbar.component.scss']
})
export class CalendarToolbarComponent implements OnInit, OnDestroy {

  public headers: string[] = [];
  private subscriptions: Subscription[] = [];
  @select(selectSettingsLanguage) public language$: Observable<string>;

  constructor() {
    this.headers = this.build();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.language$.subscribe(
        lang => this.headers = this.build()
      ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  build(): string[] {
    let date = moment().startOf('week');
    let arr = [];
    _.times(7, () => {
      arr.push(date.format('dddd'));
      date.add(1, 'days');
    });
    return arr;
  }

}
