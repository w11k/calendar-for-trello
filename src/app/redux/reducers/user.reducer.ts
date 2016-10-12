// -> Takes previous state + action, returnes new // new state
import {UserActions} from '../actions/user-actions';
import {User} from "../../models/user";

export default (state: User = new User(), action: any) => {
  switch (action.type) {
    case UserActions.ADD_USER:
      return Object.assign({}, action.payload);
    case UserActions.UPDATE_USER:
      return Object.assign({}, action.payload);
    case UserActions.REMOVE_USER:
      return new User();
    default:
      return state;
  }
}
