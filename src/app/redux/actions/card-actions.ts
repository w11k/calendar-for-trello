import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {RootState} from '../store';
import {Card} from '../../models/card';
import {TrelloHttpService} from '../../services/trello-http.service';
import {BoardActions} from './board-actions';

@Injectable()
export class CardActions {

  static ADD_CARD = 'ADD_CARD';
  static UPDATE_CARD = 'UPDATE_CARD';
  static UPDATE_CARDS_OF_BOARD = 'UPDATE_CARDS_OF_BOARD';
  static REBUILD_STORE = 'REBUILD_STORE';
  static UPDATE_DUE = 'UPDATE_DUE';
  static REMOVE_DUE = 'REMOVE_DUE';
  static ARCHIVE_CARD = 'ARCHIVE_CARD';
  static MARK_CARD_DONE = 'MARK_CARD_DONE';
  static REMOVE_CARDS_BY_BOARDID = 'REMOVE_CARDS_BY_BOARDID';
  static RESET_CARD_STORE = 'RESET_CARD_STORE';
  static CARD_CHANGE_LIST = 'CARD_CHANGE_LIST';

  constructor(private ngRedux: NgRedux<RootState>, private tHttp: TrelloHttpService) {
  }

  public addCard(card: Card) {
    this.ngRedux.dispatch({type: CardActions.ADD_CARD, payload: card});
  }

  // inserts new cards from API
  public rebuildStore(cards: Card[]) {
    this.ngRedux.dispatch({type: CardActions.REBUILD_STORE, payload: cards});
  }

  // i think this is bad:
  public updateCard(card: Card) {
    this.ngRedux.dispatch({type: CardActions.UPDATE_CARD, payload: card});
  }

  public updateCardsDue(cardId: string, due: Date) {
    this.tHttp.put('cards/' + cardId + '', {
      due: due
    }).subscribe(
      success => this.ngRedux.dispatch({type: CardActions.UPDATE_DUE, id: cardId, due: due}),
      error => console.error(error)
    );
  }

  /**
   * Only updates cards of a single board after loading*/
  public rebuildStorePartially(cards, board, time) {
    this.ngRedux.dispatch({
      type: CardActions.UPDATE_CARDS_OF_BOARD, payload: {
        boardId: board.id,
        cards: cards
      }
    });

    // update the boards lastPulledAt timestamp
    this.ngRedux.dispatch({
      type: BoardActions.UPDATE_PULLED_AT, payload: {
        boardId: board.id,
        time
      }
    });

  }

  public removeCardsByBoardId(boardId: string) {
    this.ngRedux.dispatch({type: CardActions.REMOVE_CARDS_BY_BOARDID, boardId: boardId});
  }

  public removeDue(cardId: string) {
    this.tHttp.put('cards/' + cardId + '', {
      due: 'null'
    }).subscribe(
      success => this.ngRedux.dispatch({type: CardActions.REMOVE_DUE, id: cardId}),
      error => console.error(error)
    );
  }

  public archiveCard(cardId: string) {
    this.tHttp.put('cards/' + cardId, {
      closed: true
    }).subscribe(
      success => this.ngRedux.dispatch({type: CardActions.ARCHIVE_CARD, id: cardId}),
      error => console.error(error)
    );

  }

  public resetStore() {
    this.ngRedux.dispatch({type: CardActions.RESET_CARD_STORE});
  }

  public markCardDone(card: Card) {
    this.tHttp.put('cards/' + card.id, {
      dueComplete: !card.dueComplete
    }).subscribe(
      success => this.ngRedux.dispatch({type: CardActions.MARK_CARD_DONE, payload: card}),
      error => console.error(error)
    );


  }

  //  Feature change card list - 05.06.18
  public changerCardList(cardId: string, idBoard: string, idList: string) {
    this.tHttp.put('cards/' + cardId + '', {
      idList: idList,
      cardId: cardId,
      idBoard: idBoard,
    }).subscribe(
      success => this.ngRedux.dispatch({type: CardActions.CARD_CHANGE_LIST, id: cardId, idList: idList}),
      error => console.error(error)
    );
  }

}
