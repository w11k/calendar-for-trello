// -> Takes previous state + action, returnes new // new state
import {CardActions} from '../actions/card-actions';
import {Card} from '../../models/card';

const initialState = [];

export default (state: Card[] = initialState, action: any) => {
  switch (action.type) {
    case CardActions.ADD_CARD:
      return [...state, action.payload];
    case CardActions.UPDATE_CARD:
      return state.map(card => {
        if (action.id !== card.id) {
          return card;
        }
        return Object.assign({}, card);
      });
    case CardActions.MARK_CARD_DONE:
      return state.map(card => {
        if (action.payload.id !== card.id) {
          return card;
        }
        return Object.assign({}, card, {dueComplete: !action.payload.dueComplete});
      });

    case CardActions.UPDATE_DUE:
      return state.map(card => {
        if (action.id !== card.id) {
          return card;
        }
        return Object.assign({}, card, {due: action.due});
      });
    case CardActions.REMOVE_CARDS_BY_BOARDID:
      return state.filter(card => {
        return card.idBoard !== action.boardId;
      });
    case CardActions.REBUILD_STORE:
      return [
        ...action.payload
      ];
    case CardActions.REMOVE_DUE:
      return state.map(card => {
        if (action.id !== card.id) {
          return card;
        }
        return Object.assign({}, card, {due: null});
      });

    // Feature change card list - 05.06.18
    case CardActions.CARD_CHANGE_LIST:
      return state.map(card => {
        if (action.id !== card.id) {
          return card;
        }
        return Object.assign({}, card, {idList: action.idList});
      });
    case CardActions.ARCHIVE_CARD:
      return state.filter(card => card.id !== action.id);
    case CardActions.RESET_CARD_STORE:
      return initialState;
    case CardActions.UPDATE_CARDS_OF_BOARD:
      // 1) remove all cards from board
      // 2) remove cards, which have been moved to/from another board
      // add fresh loaded cards
      // return store
      const newStore = state.filter(card => {
        const isNotInUpdatedBoard = card.idBoard !== action.payload.boardId;
        const cardWasMoved = action.payload.cards.find(c => c.id === card.id);
        return isNotInUpdatedBoard  && !cardWasMoved;
      });
      newStore.push(...action.payload.cards);
      return newStore;
    default:
      return state;
  }
};
