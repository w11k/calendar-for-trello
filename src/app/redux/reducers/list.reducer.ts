// -> Takes previous state + action, returnes new // new state
import {ListActions} from '../actions/list-actions';


const initialState = {};

export default (state: Object = initialState, action: any) => {
  switch (action.type) {
    case ListActions.SET_LIST:
      const listObj = {};
      listObj[action.payload.id] = action.payload;
      return Object.assign(state, listObj);
    case ListActions.RESET_LIST_STORE:
      return initialState;
    default:
      return state;
  }
};
