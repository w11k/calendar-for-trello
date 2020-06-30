import {Component, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {CalendarActions, PeriodChange} from '../redux/actions/calendar-actions';
import {CalendarType, SettingsActions} from '../redux/actions/settings-actions';
import {TrelloPullService} from '../services/trello-pull.service';
import {Settings} from '../models/settings';
import {AddCardComponent} from './add-card/add-card.component';
import {selectCalendarDate, selectSettingsType, selectVisibleLabelsInRange} from '../redux/store/selects';
import {MatDialog} from '@angular/material';
import {Label} from '../models/label';
import html2pdf from 'html2pdf.js';

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

  public toToday(): void {
    this.calendarActions.navigateToDate(new Date(), this.calendarType);
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

  private _returnCalDate(lang?): Date {
    return this.calendarDate ? new Date(this.calendarDate) : new Date();
  }

  printCalendar(quality =  1) {
    const months = ['january', 'february', 'march',
                    'april', 'may', 'june', 'july',
                    'august', 'september', 'october',
                    'november', 'december'];

    const actualMonth = this.calendarDate.getMonth();

    const elementToPrint = document.getElementById('nodeToRenderAsPDF');
    const opt = {
      margin:       0,
      filename:     'trello_calendar_' + months[actualMonth],
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      // jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }          // default setting
      jsPDF:        { unit: 'in', format: 'a3', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(elementToPrint).save();
  }

}
