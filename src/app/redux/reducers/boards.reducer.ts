// -> Takes previous state + action, returnes new // new state
import {Board} from '../../models/board';
import {BoardActions} from '../actions/board-actions';


const initialState = [];

export default (state: Board[] = initialState, action: any) => {
  switch (action.type) {
    case BoardActions.UPDATE_BOARDS:
      const storeAsObject = state.reduce((previousValue, currentValue) => {
        previousValue[currentValue.id] = currentValue;
        return previousValue;
      }, {});


      return action.payload.map((board: Board) => {
          if (storeAsObject[board.id] && storeAsObject[board.id].lastPulledAt) {
            // copy lastPulledAt if the board was already added to calendar
            board.lastPulledAt = storeAsObject[board.id].lastPulledAt;
          } else {
            board.lastPulledAt = null;
          }
          return board;
        }
      );
    case BoardActions.REMOVE_ALL_BOARDS:
      return initialState;
    case BoardActions.REMOVE_BOARDS:
      return state.filter(board => action.payload.includes(board) === false);
    case BoardActions.RESET_BOARD_STORE:
      return initialState;
    case BoardActions.UPDATE_PULLED_AT:
      return state.map(
        board => {
          if (board.id === action.payload.boardId) {
            board.lastPulledAt = action.payload.time;
          }
          return board;
        }
      );
    default:
      return state;
  }
};
