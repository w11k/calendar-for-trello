// -> Takes previous state + action, returnes new // new state
import {MemberActions} from '../actions/member-actions';
import {Member} from '../../models/member';
import {Action} from './action';

/*
export interface MemberMap { [s: string]: Member;
}
*/

export type MemberMap = Map<string, Member>;

const initialState: MemberMap = new Map();

export default (state: MemberMap = initialState, action: any) => {
  switch (action.type) {
    case MemberActions.SET_MEMBER:
      const memberFromState = state[action.member.id];
      let boards;


      if (!memberFromState) {
        boards = [action.board];
      } else {
        const boardsOfMember = memberFromState.boards ? memberFromState.boards : [];
        boardsOfMember.push(action.board);
        boards = boardsOfMember;
      }

      const member: Member = Object.assign({}, action.member);
      member.boards = boards;

      const memberObj = {};
      memberObj[action.member.id] = member;

      return Object.assign(state, memberObj);
    case MemberActions.RESET_MEMBER_STORE:
      return initialState;
    default:
      return state;
  }
};
