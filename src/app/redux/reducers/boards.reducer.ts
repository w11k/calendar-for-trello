// -> Takes previous state + action, returnes new // new state
import {Board} from "../../models/board";
import {BoardActions} from "../actions/board-actions";
import * as _ from "lodash"

const initialState = [];

export default (state: Board[] = initialState, action: any) => {
  switch (action.type) {
    case BoardActions.LOAD_BOARDS:
      let storeAsObject = _.keyBy(state, "id");
      return action.payload.map((board: Board) => {
          if (storeAsObject[board.id] && storeAsObject[board.id].lastPulledAt) {
            // copy lastPulledAt if the board was already added to calendar
            board.lastPulledAt = storeAsObject[board.id].lastPulledAt;
          } else {
            board.lastPulledAt = null;
          }
          return board
        }
      );
    // case BoardActions.UPDATE_BOARD_COLOR:
    //   return state.map(board => {
    //     if (action.id !== board.id) {
    //       return board
    //     }
    //     return Object.assign({}, board, {backgroundColor: action.backgroundColor});
    //   });
    case BoardActions.RESET_BOARD_STORE:
      return initialState;
    case BoardActions.UPDATE_PULLED_AT:
      return state.map(
        board => {
          if (board.id === action.payload.boardId) {
            board.lastPulledAt = action.payload.time;
          }
          return board
        }
      );
    default:
      return state;
  }
}
