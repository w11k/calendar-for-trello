import {Injectable} from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {RootState} from '../store';
import {User} from '../../models/user';

@Injectable()
export class UserActions {
  constructor(private ngRedux: NgRedux<RootState>) {
  }

  static ADD_USER: string = 'ADD_USER';
  static UPDATE_USER: string = 'UPDATE_USER';
  static REMOVE_USER: string = 'REMOVE_USER';
  static RESET_USER_STORE: string = 'RESET_USER_STORE';

  public addUser(user: User) {
    this.ngRedux.dispatch({type: UserActions.ADD_USER, payload: user});
  };

  public updateUser(user: User) {
    this.ngRedux.dispatch({type: UserActions.UPDATE_USER, payload: user});
  };

  public removeUser() {
    this.ngRedux.dispatch({type: UserActions.REMOVE_USER});
  };


  public resetStore() {
    this.ngRedux.dispatch({type: UserActions.RESET_USER_STORE});
  }

}
