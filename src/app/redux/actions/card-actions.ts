
import {Injectable} from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {RootState} from '../store';
import {Card} from "../../models/card";
import {TrelloHttpService} from "../../services/trello-http.service";

@Injectable()
export class CardActions {
  constructor(private ngRedux: NgRedux<RootState>, private tHttp: TrelloHttpService) {
  }

  static ADD_CARD: string = 'ADD_CARD';
  static UPDATE_CARD: string = 'UPDATE_CARD';
  static REBUILD_STORE: string = 'REBUILD_STORE';
  static UPDATE_DUE: string = 'UPDATE_DUE';
  static REMOVE_CARD: string = 'REMOVE_CARD';

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
    this.tHttp.put("cards/" + cardId + "", {
      due: due
    }).subscribe(
      success => this.ngRedux.dispatch({type: CardActions.UPDATE_DUE, id: cardId, due: due}),
      error => console.log(error)
    );
  };

  public removeCards(cardId: string) {
    this.ngRedux.dispatch({type: CardActions.REMOVE_CARD, id: cardId});
  };

}
