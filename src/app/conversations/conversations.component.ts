import {Card} from '../models/card';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConversationsService, MysteriousCardObject} from './conversations.service';
import {Observable} from 'rxjs';
import {select} from '@angular-redux/store';
import {User} from '../models/user';
import {Member} from '../models/member';
import {Select, Store} from '@ngxs/store';
import {
  AddInbox,
  AddOutbox,
  ClearInbox,
  ClearOutbox,
  HideHelp,
  HideLoadButton,
  UpdateLastUpdate
} from './ngxs/app.action';
import {InboxState} from './ngxs/inbox.state';
import {OutboxState} from './ngxs/outbox.state';
import {ConversationsState} from './ngxs/conversations.state';
import {take} from 'rxjs/operators';
import {TrackingService} from '../tracking/tracking.service';
import {TrackingEvent} from '../tracking/tracking-event.model';

export enum Phase {
  Done,
  Prepare,
  Fetch,
}

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})

export class ConversationsComponent implements OnInit, OnDestroy {

  @select('user') public user$: Observable<User>;
  @select('members') public members$: Observable<{ [id: string]: Member }>;
  @select('cards') public cards$: Observable<Card[]>;


  currentPhase: Phase = Phase.Done;
  phaseEnum = Phase;

  @Select(InboxState.getInbox) inbox$: Observable<Card[]>;
  @Select(OutboxState.getOutbox) outbox$: Observable<Card[]>;
  @Select(ConversationsState.getLastUpdate) lastUpdate$: Observable<Date | undefined>;
  @Select(ConversationsState.getHideHelp) hideHelp$: Observable<boolean>;
  @Select(ConversationsState.getHideLoadButton) hideLoadButton$: Observable<boolean>;

  loadingInfo = {
    members: 0,
    cards: 0,
    loadedMembers: 0,
    loadedCards: 0,
  };

  constructor(private conversationsService: ConversationsService,
              private store: Store,
              private trackingService: TrackingService,
  ) {
  }

  ngOnInit() {
  }

  async fetchingProcedure() {

    /******************************************************
     * 1. Reset:
     ******************************************************/
    this.loadingInfo = {
      members: 0,
      cards: 0,
      loadedMembers: 0,
      loadedCards: 0,
    };


    this.currentPhase = Phase.Prepare;

    this.store.dispatch([
      new ClearOutbox(),
    ]);

    this.store.dispatch([
      new ClearInbox(),
    ]);


    /******************************************************
     * 2. Load some required data from store
     ******************************************************/

    const allCards = await this.cards$
      .pipe(take(1))
      .toPromise();

    const membersMap = await this.members$
      .pipe(take(1))
      .toPromise();

    const user = await this.user$
      .pipe(take(1))
      .toPromise();


    const membersArr: Member[] = Object
      .keys(membersMap)
      .map(it => membersMap[it]);

    const otherMemberNames = membersArr
      .filter(it => it.username !== user.username)
      .map(it => it.username);


    /***************************************************
     * 3. Fetch Cards per User:
     ***************************************************/

    this.loadingInfo.members = membersArr.length;

    // no longer used, since comment cards from all cards are checked upon tagging of a member of the board.
    // let cards: any;
/*
    const memberRequestArr = membersArr
      .map(async member => {
        cards = await this.conversationsService.getCardsByUser(member.username);
        this.loadingInfo.loadedMembers++;

        return cards;
      });
*/
     // const responses: Card[][] = await Promise.all(memberRequestArr);

    const doubleAllCards: Card[][] = [allCards, allCards];
    const responses: Card[][] = await Promise.all(doubleAllCards);
    this.trackingService.track(new TrackingEvent('conversations', 'loaded-members', `${this.loadingInfo.members}`));

    const cardMap = new Map<string, Card>();
    // Put all Cards in a Map in order to remove duplicates
    responses
      .reduce((previousValue, currentValue) => [...previousValue, ...currentValue], [])
      .map(card => cardMap.set(card.id, card));


    /******************************************************
     * 4. Fetch the Comments per Card
     ******************************************************/

    this.currentPhase = Phase.Fetch;
    this.loadingInfo.cards = cardMap.size;

    const allRequests = Array.from(cardMap.values())
      .map(async card => {

        let data;
        if (card.badges.comments > 0) {
          data = await this.conversationsService.getCommentCards(card.id).toPromise();

          this.loadingInfo.loadedCards++;

          try {
            this.checkInAndOutBox(data as any, user.id, user.username, otherMemberNames, allCards);
          } catch (e) {
            console.error(e);
          }
        }
      });

    // be Done in any case - even if requests fail.
    Promise.all(allRequests)
      .catch(err => this.trackingService.track(new TrackingEvent('conversations', 'failed', `error`)))
      .finally(() => {
        this.trackingService.track(new TrackingEvent('conversations', 'loaded-cards', `${this.loadingInfo.cards}`));
        this.currentPhase = Phase.Done;
        this.store.dispatch(new UpdateLastUpdate());
      });
  }


  checkInAndOutBox(commentCards: MysteriousCardObject[],
                   myUserId: string,
                   myUsername: string,
                   otherMemberNames: string[],
                   allCards: Card[]) {

    let fullCard: Card;

    for (let i = 0; i < commentCards.length; i++) {
      if (commentCards[i].data.text.includes('@' + myUsername)) {
        fullCard = allCards.find(it => it.id === commentCards[i].data.card.id);
        this.store.dispatch(new AddInbox(fullCard));
      }
    }

    for (const name of otherMemberNames) {
      for (let i = 0; i < commentCards.length; i++) {
        if (commentCards[i].data.text.includes('@' + name) && commentCards[i].idMemberCreator === myUserId) {
          fullCard = allCards.find(it => it.id === commentCards[i].data.card.id);
          this.store.dispatch(new AddOutbox(fullCard));
        }
      }
    }
  }


  hide() {
    this.store.dispatch(new HideHelp());
  }


  hideLoadButton() {
    this.store.dispatch(new HideLoadButton());
  }

  ngOnDestroy(): void {
  }

}
