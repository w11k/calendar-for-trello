// -> Takes previous state + action, returnes new // new state
import {CardActions} from '../actions/card-actions';
import {Card} from "../../models/card";

export default (state: Card[] = [], action: any) => {
  switch (action.type) {
    case CardActions.ADD_CARD:
      return [...state, action.payload];
    case CardActions.UPDATE_CARD:
      // todo: should be more fine-grained than this, like update name, due, and so on! (performance)
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
    default:
      return state;
  }
}
