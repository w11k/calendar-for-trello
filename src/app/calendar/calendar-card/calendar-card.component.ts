import {Component, OnInit, Input, HostBinding, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {Card} from '../../models/card';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {Board} from '../../models/board';
import * as _ from 'lodash';
import {List} from '../../models/list';
import {selectBoardColorPrefs} from '../../redux/store/selects';
import {MemberMap} from '../../redux/reducers/member.reducer';
import {CalendarActions} from '../../redux/actions/calendar-actions';
import {CardActions} from '../../redux/actions/card-actions';
import moment = require('moment');

@Component({
  selector: 'app-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarCardComponent implements OnInit, OnDestroy {

  public list: List;
  public board: Board;
  private subscriptions: Subscription[] = [];
  public memberMap: MemberMap;

  @select(selectBoardColorPrefs) public boardColorPrefs$: Observable<Object>;
  @select('boards') public boards$: Observable<Board[]>;
  @select('lists') public lists$: Observable<Object>;
  @select('members') public members$: Observable<MemberMap>;

  @HostBinding('style.border-left-color') borderLeft;
  @HostBinding('class.dueComplete') dueComplete;
  @Input() public card: Card;
  @Input() public showTime: Boolean = false;

  constructor(private cardActions: CardActions) {
  }

  getAvatar(userId: string) {
    return this.memberMap ? (this.memberMap[userId] ? this.memberMap[userId].avatarHash : '' ) : '';
  }

  ngOnInit() {
    this.subscriptions.push(
      Observable
        .combineLatest(this.boardColorPrefs$, this.boards$, this.lists$)
        .subscribe(x => {
          const boardColorPrefs = x[0];
          const boards: Board[] = x[1];
          const lists = x[2];
          this.list = lists ? lists[this.card.idList] : '';
          this.board = _.find(boards, (board: Board) => board.id === this.card.idBoard);
          this.borderLeft = boardColorPrefs[this.card.idBoard] || (this.board ? this.board.prefs.backgroundColor : null);
        }));

    this.subscriptions.push(
      this.members$.subscribe(
        memberMap => this.memberMap = memberMap
      )
    );

    this.dueComplete = this.card.dueComplete;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  plus(amount: number, unit: 'week' | 'month') {
    const nextDue = moment(this.card.due).add(amount, unit);
    this.cardActions.updateCardsDue(this.card.id, nextDue.toDate());
  }
}
