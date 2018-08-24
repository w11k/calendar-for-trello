import {Component, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {CalendarActions, PeriodChange} from '../redux/actions/calendar-actions';
import {CalendarType, SettingsActions} from '../redux/actions/settings-actions';
import {TrelloPullService} from '../services/trello-pull.service';
import {Settings} from '../models/settings';
import {AddCardComponent} from './add-card/add-card.component';
import {
  selectCalendarDate,
  selectCalendarDays,
  selectSettingsType,
  selectVisibleLabelsInRange
} from '../redux/store/selects';
import {format} from 'date-fns';
import {MatDialog} from '@angular/material';
import {Label} from '../models/label';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  calendarType: CalendarType;
  CalendarType = CalendarType;
  calendarDate: Date; // todo remove

  @select(selectCalendarDate) public calendarDate$: Observable<any>;
  @select(selectSettingsType) public calendarType$: Observable<any>;
  @select(selectVisibleLabelsInRange) public labels$: Observable<Label[]>;
  public current: string;

  @select('settings') public settings$: Observable<Settings>;
  public settings: Settings = new Settings();
  private subscriptions: Subscription[] = [];

  constructor(public calendarActions: CalendarActions, private settingsActions: SettingsActions,
              public matDialog: MatDialog, public trelloPullService: TrelloPullService) {
  }

  ngOnInit() {

    this.subscriptions.push(this.calendarDate$.subscribe(
      date => {
        this.calendarDate = date;
        this.current = this.determineCurrent(date, this.calendarType);
      }
    ));

    this.subscriptions.push(this.calendarType$.subscribe(
      type => this.calendarType = type
    ));

    this.subscriptions.push(
      (this.settings$).subscribe(x => {
        this.settings = x;
        this.calendarActions.buildDays(this._returnCalDate(), this.calendarType);
      }));

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public toggleMode(calendarType: CalendarType) {
    this.calendarType = calendarType;
    this.settingsActions.changeCalendarType(calendarType);
    this.calendarActions.buildDays(new Date(), this.calendarType);
  }


  public previous() {
    this.calendarActions.navigate(this._returnCalDate(), PeriodChange.subtract, this.calendarType);
  }

  public next() {
    this.calendarActions.navigate(this._returnCalDate(), PeriodChange.add, this.calendarType);
  }

  public determineCurrent(date: Date, type: CalendarType) {
    switch (type) {
      case CalendarType.Month:
        return format(date, 'MMMM, YYYY');
      case CalendarType.Week:
      case CalendarType.WorkWeek:
        return 'KW' + format(date, 'W, MMMM YYYY');
    }
  }

  public toToday(): void {
    this.calendarActions.navigateToDate(new Date(), this.calendarType);
  }

  private _returnCalDate(lang?): Date {
    return this.calendarDate ? new Date(this.calendarDate) : new Date();
  }

  public addCard() {
    const dialogRef = this.matDialog.open(AddCardComponent, {
      width: '600px',
    });


    this.subscriptions.push(
      dialogRef.afterClosed().subscribe(
        (wasSuccess: boolean) => {
          if (wasSuccess) {
            this.trelloPullService.pull();
          }
        }
      )
    );
  }
}
