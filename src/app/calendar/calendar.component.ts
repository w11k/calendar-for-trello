import {Component, OnInit} from "@angular/core";
import * as moment from "moment";
import {Moment} from "moment";
import {select} from "ng2-redux";
import {Observable, Subscription, ReplaySubject} from "rxjs";
import {CalendarActions, PeriodChange} from "../redux/actions/calendar-actions";
import {SettingsActions, CalendarType} from "../redux/actions/settings-actions";
import {TrelloPullService} from "../services/trello-pull.service";
import {Settings} from "../models/settings";
import {MdDialog} from "@angular/material";
import {AddCardComponent} from "./add-card/add-card.component";
import {
  selectCalendarDays,
  selectSettingsType,
  selectCalendarDate,
  selectSettingsLanguage
} from "../redux/store/selects";
import {CalendarTypeSelectEvent} from "./calendar-type-selector/calendar-type-selector.component";
import {CalendarService} from "../services/calendar.service";
import {times} from "lodash";
import {CalendarDay} from "../models/calendar-day";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  calendarType: CalendarType;
  CalendarType = CalendarType;
  calendarDate: Moment; // todo remove
  @select(selectCalendarDays) public calendar$: Observable<any>;
  @select(selectCalendarDate) public calendarDate$: Observable<any>;
  @select(selectSettingsType) public calendarType$: Observable<any>;
  @select(selectSettingsLanguage) public language$: Observable<string>;
  public current: string;

  @select("settings") public settings$: Observable<Settings>;
  public settings: Settings = new Settings();
  private subscriptions: Subscription[] = [];


  daySlots: ReplaySubject<CalendarDay>[] = [];

  constructor(public calendarActions: CalendarActions, private settingsActions: SettingsActions,
              public mdDialog: MdDialog, public trelloPullService: TrelloPullService, private calendarService: CalendarService) {

    times(42, () => {
      this.daySlots.push(new ReplaySubject<CalendarDay>(1));
    });



  }


  ngOnInit() {

    this.calendarService.days$.subscribe(
        days => {
          console.log("DAYS2", days);

          // fill in existing days
          days.map((day, index) => {
            this.daySlots[index].next(day);
          });

          // emit null to other days:
          let remaining = 42 - days.length;
          let i = 0;
          times(remaining, () => {

            this.daySlots[i + days.length].next(null);
            i++;
          });


        }
    )


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
      Observable
        .combineLatest(this.language$, this.settings$).subscribe(x => {
        const lang = x[0]; // only needed for async reasons.
        this.settings = x[1];
        // this.calendarActions.buildDays(this._returnCalDate(lang), this.calendarType)
      }));

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private _returnCalDate(lang?): Moment {
    let date = this.calendarDate ? this.calendarDate.clone() : moment();
    if (lang) {
      date.locale(lang)
    }
    return date;
  }


  public previous() {
    this.calendarActions.navigate(this._returnCalDate(), PeriodChange.subtract, this.calendarType);
  }

  public next() {
    console.log("next", this._returnCalDate(), PeriodChange.add, this.calendarType);
    this.calendarActions.navigate(this._returnCalDate(), PeriodChange.add, this.calendarType);
  }

  public toggleMode($event: CalendarTypeSelectEvent) {
    this.settingsActions.changeCalendarType($event.calendarType);
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

  public addCard() {
    let dialogRef = this.mdDialog.open(AddCardComponent, {
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
    )
  }
}
