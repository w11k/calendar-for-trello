// Hint: Action is triggered by user interaction, network request, ...

import {Injectable} from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {RootState} from '../store';
import {Board} from '../../models/board';

@Injectable()
export class BoardActions {
  static UPDATE_BOARD_COLOR: string = 'UPDATE_BOARD_COLOR';
  static LOAD_BOARDS: string = 'LOAD_BOARDS';
  static RESET_BOARD_STORE: string = 'RESET_BOARD_STORE';
  static UPDATE_PULLED_AT: string = 'UPDATE_PULLED_AT';

  constructor(private ngRedux: NgRedux<RootState>) {
  }

  public updateBoardColor(id: string, backgroundColor: string) {
    this.ngRedux.dispatch({type: BoardActions.UPDATE_BOARD_COLOR, id, backgroundColor});
  };

  // inserts new cards from API
  public loadBoards(boards: Board[]) {
    this.ngRedux.dispatch({type: BoardActions.LOAD_BOARDS, payload: boards});
  };

  public resetStore() {
    this.ngRedux.dispatch({type: BoardActions.RESET_BOARD_STORE});
  }

}
