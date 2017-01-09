import {Component, OnInit, Input, HostBinding} from '@angular/core';
import {Card} from "../../models/card";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {Board} from "../../models/board";
import * as _ from "lodash"
import {List} from "../../models/list";

@Component({
  selector: 'app-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss']
})
export class CalendarCardComponent implements OnInit {

  public list: List;
  public board: Board;

  @select(state => state.settings.boardColorPrefs) public boardColorPrefs$: Observable<Object>;
  @select(state => state.boards) public boards$: Observable<Board[]>;
  @select(state => state.lists) public lists$: Observable<Object>;

  @HostBinding('style.border-left-color') borderLeft;
  @HostBinding('class.dueComplete') dueComplete;
  @Input() public card: Card;

  constructor() {
  }

  ngOnInit() {
    Observable
      .combineLatest(this.boardColorPrefs$, this.boards$, this.lists$)
      .subscribe(x => {
        const boardColorPrefs = x[0];
        const boards: Board[] = x[1];
        const lists = x[2];
        this.list = lists[this.card.idList];
        this.board = _.find(boards, (board: Board) => board.id === this.card.idBoard);
        this.borderLeft = boardColorPrefs[this.card.idBoard] || (this.board ? this.board.prefs.backgroundColor : null);
      });

    this.dueComplete = this.card.dueComplete;
  }
}
