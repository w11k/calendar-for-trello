import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {RootState} from '../store';
import {List} from '../../models/list';
import {Board} from '../../models/board';

@Injectable()
export class ListActions {
  static SET_LIST = 'SET_LIST';
  static RESET_LIST_STORE = 'RESET_LIST_STORE';
  static UPDATE_PULLED_AT = 'UPDATE_PULLED_AT';

  constructor(private ngRedux: NgRedux<RootState>) {
  }

  public resetStore() {
    this.ngRedux.dispatch({type: ListActions.RESET_LIST_STORE});
  }


  public rebuildStorePartially(lists: List[], board: Board, time: Date) {
    lists.map(
      list => this.ngRedux.dispatch({type: ListActions.SET_LIST, payload: list})
    );
  }
}
