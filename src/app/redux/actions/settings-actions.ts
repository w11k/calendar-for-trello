// Hint: Action is triggered by user interaction, network request, ...

import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {RootState} from '../store';

export enum CalendarType {
  Week, Month, WorkWeek
}

export enum WeekStart {
  Sunday, Monday
}

@Injectable()
export class SettingsActions {

  static RESET_SETTINGS_STORE = 'RESET_SETTINGS_STORE';
  static SET_BOARD_COLOR = 'SET_BOARD_COLOR';
  static SET_BOARD_VISIBILITY = 'SET_BOARD_VISIBILITY';
  static REMOVE_BOARD_PREFERENCES = 'REMOVE_BOARD_PREFERENCES';
  static CHANGE_TYPE = 'CHANGE_TYPE';
  static TOGGLE_INCLUDE_DONE = 'TOGGLE_INCLUDE_DONE';
  static TOGGLE_SHOW_MEMBERS = 'TOGGLE_SHOW_MEMBERS';
  static SET_FILTER_FOR_USER = 'SET_FILTER_FOR_USER';
  static TOGGLE_WEEKVIEW_SHOW_HOURS = 'TOGGLE_WEEKVIEW_SHOW_HOURS';
  static SET_WEEKSTART = 'SET_WEEKSTART';
  static SET_SHOW_WEEKEND = 'SET_SHOW_WEEKEND';
  static SET_BUSINESS_HOURS_START = 'SET_BUSINESS_HOURS_START';
  static SET_BUSINESS_HOURS_END = 'SET_BUSINESS_HOURS_END';
  static SET_FILTER_FOR_LABEL = 'SET_FILTER_FOR_LABEL';


  constructor(private ngRedux: NgRedux<RootState>) {
  }

  setWeekStart(weekStart: WeekStart) {
    this.ngRedux.dispatch({type: SettingsActions.SET_WEEKSTART, payload: weekStart});
  }

  public toggleIncludeDoneCards(preference: boolean) {
    this.ngRedux.dispatch({type: SettingsActions.TOGGLE_INCLUDE_DONE, payload: preference});
  }

  public changeCalendarType(calendarType: CalendarType) {
    this.ngRedux.dispatch({type: SettingsActions.CHANGE_TYPE, payload: calendarType});
  }

  public resetStore() {
    this.ngRedux.dispatch({type: SettingsActions.RESET_SETTINGS_STORE});
  }

  public resetBoardPrefs() {
    // keeps language
    this.ngRedux.dispatch({type: SettingsActions.REMOVE_BOARD_PREFERENCES});
  }

  public setBoardColor(boardId: string, color: string) {
    this.ngRedux.dispatch({type: SettingsActions.SET_BOARD_COLOR, payload: {boardId, color}});
  }

  public setBoardVisibility(boardId: string, visibility: boolean) {
    this.ngRedux.dispatch({type: SettingsActions.SET_BOARD_VISIBILITY, payload: {boardId, visibility}});
  }

  public setFilterForUser(userId: string) {
    this.ngRedux.dispatch({type: SettingsActions.SET_FILTER_FOR_USER, payload: userId});
  }

  public toggleWeekviewShowHours(preference: boolean) {
    this.ngRedux.dispatch({type: SettingsActions.TOGGLE_WEEKVIEW_SHOW_HOURS, payload: preference});
  }

  public setShowWeekend(showWeekend: boolean) {
    this.ngRedux.dispatch({type: SettingsActions.SET_SHOW_WEEKEND, payload: showWeekend});
  }

  public setBusinessHoursStart(startHour: number) {
    this.ngRedux.dispatch({type: SettingsActions.SET_BUSINESS_HOURS_START, payload: startHour});
  }

  public setBusinessHoursEnd(endHour: number) {
    this.ngRedux.dispatch({type: SettingsActions.SET_BUSINESS_HOURS_END, payload: endHour});
  }

  public setFilterForLabel(labelName: string) {
    this.ngRedux.dispatch({type: SettingsActions.SET_FILTER_FOR_LABEL, payload: labelName});
  }

}
