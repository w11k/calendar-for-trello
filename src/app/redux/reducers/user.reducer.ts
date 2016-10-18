// -> Takes previous state + action, returnes new // new state
import {UserActions} from '../actions/user-actions';
import {User} from "../../models/user";

const initialState = new User();

export default (state: User = initialState, action: any) => {
  switch (action.type) {
    case UserActions.ADD_USER:
      return Object.assign({}, action.payload);
    case UserActions.UPDATE_USER:
      return Object.assign({}, action.payload);
    case UserActions.REMOVE_USER:
      return new User();
    case UserActions.RESET_USER_STORE:
      return initialState;
    default:
      return state;
  }
}
