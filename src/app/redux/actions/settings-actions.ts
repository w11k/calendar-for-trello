// Hint: Action is triggered by user interaction, network request, ...

import {Injectable} from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {RootState} from '../store';

@Injectable()
export class SettingsActions {
  constructor(private ngRedux: NgRedux<RootState>) {
  }

  static TOGGLE_OBSERVER_MODE: string = 'TOGGLE_OBSERVER_MODE';

  public toggleObserverMode() {
    this.ngRedux.dispatch({type: SettingsActions.TOGGLE_OBSERVER_MODE});
  };
}
