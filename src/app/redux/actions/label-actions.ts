import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {RootState} from '../store';
import {Label} from '../../models/label';
import {Board} from '../../models/board';

@Injectable()
export class LabelActions {
  static SET_LABEL: string = 'SET_LABEL';
  static RESET_LABEL_STORE: string = 'RESET_LABEL_STORE';
  static UPDATE_PULLED_AT: string = 'UPDATE_PULLED_AT';

  constructor(private ngRedux: NgRedux<RootState>) {
  }

  public resetStore() {
    this.ngRedux.dispatch({type: LabelActions.RESET_LABEL_STORE});
  }


  public rebuildStorePartially(labels: Label[], board: Board, time: Date) {
    labels.map(
      label => this.ngRedux.dispatch({type: LabelActions.SET_LABEL, payload: label})
    );
  }
}
