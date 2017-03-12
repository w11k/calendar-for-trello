import {Injectable} from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {RootState} from '../store';
import {Card} from '../../models/card';
import {TrelloHttpService} from '../../services/trello-http.service';
import {BoardActions} from './board-actions';

@Injectable()
export class CardActions {

  static ADD_CARD: string = 'ADD_CARD';
  static UPDATE_CARD: string = 'UPDATE_CARD';
  static UPDATE_CARDS_OF_BOARD: string = 'UPDATE_CARDS_OF_BOARD';
  static REBUILD_STORE: string = 'REBUILD_STORE';
  static UPDATE_DUE: string = 'UPDATE_DUE';
  static REMOVE_DUE: string = 'REMOVE_DUE';
  static ARCHIVE_CARD: string = 'ARCHIVE_CARD';
  static MARK_CARD_DONE: string = 'MARK_CARD_DONE';
  static REMOVE_CARD: string = 'REMOVE_CARD';
  static RESET_CARD_STORE: string = 'RESET_CARD_STORE';

  constructor(private ngRedux: NgRedux<RootState>, private tHttp: TrelloHttpService) {
  }

  public addCard(card: Card) {
    this.ngRedux.dispatch({type: CardActions.ADD_CARD, payload: card});
  };

  // inserts new cards from API
  public rebuildStore(cards: Card[]) {
    this.ngRedux.dispatch({type: CardActions.REBUILD_STORE, payload: cards});
  };

  // i think this is bad:
  public updateCard(card: Card) {
    this.ngRedux.dispatch({type: CardActions.UPDATE_CARD, payload: card});
  };

  public updateCardsDue(cardId: string, due: Date) {
    this.tHttp.put('cards/' + cardId + '', {
      due: due
    }).subscribe(
      success => this.ngRedux.dispatch({type: CardActions.UPDATE_DUE, id: cardId, due: due}),
      error => console.log(error)
    );
  };

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

  public removeCards(cardId: string) {
    this.ngRedux.dispatch({type: CardActions.REMOVE_CARD, id: cardId});
  };

  public removeDue(cardId: string) {
    this.tHttp.put('cards/' + cardId + '', {
      due: 'null'
    }).subscribe(
      success => this.ngRedux.dispatch({type: CardActions.REMOVE_DUE, id: cardId}),
      error => console.log(error)
    );
  }

  public archiveCard(cardId: string) {
    this.tHttp.put('cards/' + cardId, {
      closed: true
    }).subscribe(
      success => this.ngRedux.dispatch({type: CardActions.ARCHIVE_CARD, id: cardId}),
      error => console.log(error)
    );

  }

  public resetStore() {
    this.ngRedux.dispatch({type: CardActions.RESET_CARD_STORE})
  }

  public markCardDone(card: Card) {
    this.tHttp.put('cards/' + card.id, {
      dueComplete: !card.dueComplete
    }).subscribe(
      success => this.ngRedux.dispatch({type: CardActions.MARK_CARD_DONE, payload: card}),
      error => console.log(error)
    );


  }

}
