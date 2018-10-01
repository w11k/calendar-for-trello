import {Component, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {Board} from '../models/board';
import {SettingsActions, WeekStart} from '../redux/actions/settings-actions';
import {Settings} from '../models/settings';
import {selectOpenBoards} from '../redux/store/selects';

@Component({
  selector: 'app-board-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  readonly WeekStart = WeekStart;
  private subscriptions: Subscription[] = [];

  @select(selectOpenBoards) public boards$: Observable<Board[]>;
  boards: Board[];

  @select('settings') public settings$: Observable<Settings>;
  public settings: Settings = new Settings();

  constructor(private settingsActions: SettingsActions) {
  }


  public updateWeekStart(weekStart: WeekStart) {
    this.settingsActions.setWeekStart(weekStart);
  }

  public updateIncludeDoneCards(includePref: boolean) {
    this.settingsActions.toggleIncludeDoneCards(includePref);
  }

  public updateWeekviewShowHours(includePref: boolean) {
    this.settingsActions.toggleWeekviewShowHours(includePref);
  }

  public updateShowWeekend(showWeekend: boolean) {
    this.settingsActions.setShowWeekend(showWeekend);
  }

  public updateBusinessHoursStart(startHour: number) {
    this.settingsActions.setBusinessHoursStart(startHour);
  }

  public updateBusinessHoursEnd(endHour: number) {
    this.settingsActions.setBusinessHoursEnd(endHour);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.boards$.subscribe(
        boards => {
          this.boards = boards
            .map(board => Object.assign({}, board));
        }
      ));
    this.subscriptions.push(
      this.settings$.subscribe(
        settings => {
          this.settings = settings;
        }
      ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
