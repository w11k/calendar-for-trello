// -> Takes previous state + action, returnes new // new state
import {CardActions} from '../actions/card-actions';
import {Card} from "../../models/card";

const initialState = [];

export default (state: Card[] = initialState, action: any) => {
  switch (action.type) {
    case CardActions.ADD_CARD:
      return [...state, action.payload];
    case CardActions.UPDATE_CARD:
      return state.map(card => {
        if (action.id !== card.id) {
          return card
        }
        return Object.assign({}, card)
      });
    case CardActions.UPDATE_DUE:
      return state.map(card => {
        if (action.id !== card.id) {
          return card
        }
        return Object.assign({}, card, {due: action.due});
      });
    case CardActions.REMOVE_CARD:
      return state.filter(card => {
        return card.id !== action.id;
      });
    case CardActions.REBUILD_STORE:
      return [
        ...action.payload
      ];
    case CardActions.REMOVE_DUE:
      return state.map(card => {
        if (action.id !== card.id) {
          return card
        }
        return Object.assign({}, card, {due: null});
      });
    case CardActions.ARCHIVE_CARD:
      return state.filter(card => card.id !== action.id);
    case CardActions.RESET_CARD_STORE:
      return initialState;
    default:
      return state;
  }
}
