// -> Takes previous state + action, returnes new // new state
import {Board} from "../../models/board";
import {BoardActions} from "../actions/board-actions";

export default (state: Board[] = [], action: any) => {
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
    default:
      return state;
  }
}
