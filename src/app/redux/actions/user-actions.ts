import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {RootState} from '../store';
import {User} from '../../models/user';

@Injectable()
export class UserActions {
  static ADD_USER = 'ADD_USER';
  static UPDATE_USER = 'UPDATE_USER';
  static REMOVE_USER = 'REMOVE_USER';
  static RESET_USER_STORE = 'RESET_USER_STORE';

  constructor(private ngRedux: NgRedux<RootState>) {
  }

  public addUser(user: User) {
    this.ngRedux.dispatch({type: UserActions.ADD_USER, payload: user});
  }

  public updateUser(user: User) {
    this.ngRedux.dispatch({type: UserActions.UPDATE_USER, payload: user});
  }

  public removeUser() {
    this.ngRedux.dispatch({type: UserActions.REMOVE_USER});
  }


  public resetStore() {
    this.ngRedux.dispatch({type: UserActions.RESET_USER_STORE});
  }

}
