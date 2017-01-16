import {Component, OnInit} from '@angular/core';
import {Moment} from "moment";
import * as moment from "moment";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {CalendarActions, PeriodChange} from "../redux/actions/calendar-actions";
import {SettingsActions, CalendarType} from "../redux/actions/settings-actions";
import {TrelloPullService} from "../services/trello-pull.service";
import {Settings} from "../models/settings";
import {MdDialog} from "@angular/material";
import {AddCardComponent} from "./add-card/add-card.component";
import {
  selectCalendarDays, selectSettingsType, selectCalendarDate,
  selectSettingsLanguage
} from "../redux/store/selects";

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

  constructor(public calendarActions: CalendarActions, private settingsActions: SettingsActions, public mdDialog: MdDialog, public trelloPullService: TrelloPullService) {
  }

  ngOnInit() {
    this.settings$.subscribe(
      settings => {
        this.settings = settings;
        moment.locale(settings.language);
      }
    );

    this.calendarDate$.subscribe(
      date => {
        this.calendarDate = date;
        this.current = this.determineCurrent(date, this.calendarType);
      }
    );
    this.calendarType$.subscribe(
      type => this.calendarType = type
    );
    this.language$.subscribe(lang => {
      if (this.calendarDate) {
        this.calendarDate = moment(this.calendarDate.format()).locale(lang || "en")
      }
      this.calendarActions.buildDays(this._returnCalDate(), this.calendarType)
    })

  }

  private _returnCalDate(): Moment {
    return typeof this.calendarDate ? this.calendarDate.clone() : moment()
  }


  public previous() {
    this.calendarActions.navigate(this._returnCalDate(), PeriodChange.subtract, this.calendarType);
  }

  public next() {
    this.calendarActions.navigate(this._returnCalDate(), PeriodChange.add, this.calendarType);
  }

  public toggleMode() {
    this.settingsActions.changeCalendarType();
    this.calendarActions.buildDays(moment(), this.calendarType);
  }

  public toggleObserverMode() {
    this.settingsActions.toggleObserverMode();
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

    dialogRef.afterClosed().subscribe(
      (wasSuccess: boolean) => {
        if (wasSuccess) {
          this.trelloPullService.pull();
        }
      }
    )
  }
}
