// -> Takes previous state + action, returnes new // new state
import {MemberActions} from "../actions/member-actions";
import {Member} from "../../models/member";
import {Action} from "./action";

export interface MemberMap { [s: string]: Member;
}

const initialState: MemberMap = {};

export default (state: MemberMap = initialState, action: Action<Member>) => {
  switch (action.type) {
    case MemberActions.SET_MEMBER:
      let memberObj = {};
      memberObj[action.payload.id] = action.payload;
      return Object.assign(state, memberObj);
    case MemberActions.RESET_MEMBER_STORE:
      return initialState;
    default:
      return state;
  }
}
