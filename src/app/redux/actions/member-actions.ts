import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {RootState} from '../store';
import {Member} from '../../models/member';
import {Board} from '../../models/board';

@Injectable()
export class MemberActions {
  static SET_MEMBER = 'SET_MEMBER';
  static RESET_MEMBER_STORE = 'RESET_MEMBER_STORE';
  static UPDATE_PULLED_AT = 'UPDATE_PULLED_AT';

  constructor(private ngRedux: NgRedux<RootState>) {
  }

  public resetStore() {
    this.ngRedux.dispatch({type: MemberActions.RESET_MEMBER_STORE});
  }


  public rebuildStorePartially(members: Member[], board: Board, time: Date) {
    members.map(
      member => this.ngRedux.dispatch({type: MemberActions.SET_MEMBER, member: member, board: board})
    );
  }
}
