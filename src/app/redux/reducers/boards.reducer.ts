// -> Takes previous state + action, returnes new // new state
import {Board} from "../../models/board";
import {BoardActions} from "../actions/board-actions";

const initialState = [];

export default (state: Board[] = initialState, action: any) => {
  switch (action.type) {
    case BoardActions.LOAD_BOARDS:
      return [...action.payload];
    case BoardActions.UPDATE_BOARD_COLOR:
      return state.map(board => {
        if (action.id !== board.id) {
          return board
        }
        return Object.assign({}, board, {backgroundColor: action.backgroundColor});
      });
    case BoardActions.RESET_BOARD_STORE:
      return initialState;
    default:
      return state;
  }
}
