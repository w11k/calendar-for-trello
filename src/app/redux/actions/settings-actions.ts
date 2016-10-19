// Hint: Action is triggered by user interaction, network request, ...

import {Injectable} from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {RootState} from '../store';

@Injectable()
export class SettingsActions {
  constructor(private ngRedux: NgRedux<RootState>) {
  }

  static TOGGLE_OBSERVER_MODE: string = 'TOGGLE_OBSERVER_MODE';
  static SET_LANG: string = 'SET_LANG';
  static RESET_SETTINGS_STORE: string = 'RESET_SETTINGS_STORE';
  static SET_BOARD_COLOR: string = 'SET_BOARD_COLOR';
  static SET_BOARD_VISIBILITY: string = 'SET_BOARD_VISIBILITY';
  static REMOVE_BOARD_PREFERENCES: string = 'REMOVE_BOARD_PREFERENCES';

  public toggleObserverMode() {
    this.ngRedux.dispatch({type: SettingsActions.TOGGLE_OBSERVER_MODE});
  };

  public setLanguage(locale: string) {
    this.ngRedux.dispatch({type: SettingsActions.SET_LANG, payload: locale});
  };


  public resetStore() {
    this.ngRedux.dispatch({type: SettingsActions.RESET_SETTINGS_STORE})
  }

  public resetBoardPrefs() {
    // keeps language
    this.ngRedux.dispatch({type: SettingsActions.REMOVE_BOARD_PREFERENCES})
  }

  public setBoardColor(boardId: string, color: string) {
    this.ngRedux.dispatch({type: SettingsActions.SET_BOARD_COLOR, payload: {boardId, color}})
  }

  public setBoardVisibility(boardId: string, visibility: boolean) {
    this.ngRedux.dispatch({type: SettingsActions.SET_BOARD_VISIBILITY, payload: {boardId, visibility}})
  }
}
