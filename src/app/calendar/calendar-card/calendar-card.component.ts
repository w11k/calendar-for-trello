import {Component, OnInit, Input, HostBinding} from '@angular/core';
import {Card} from "../../models/card";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {Board} from "../../models/board";
import * as _ from "lodash"

@Component({
  selector: 'app-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss']
})
export class CalendarCardComponent implements OnInit {

  @Input() public card: Card;
  @select(state => state.settings.boardColorPrefs) public boardColorPrefs$: Observable<Object>;
  @select(state => state.boards) public boards$: Observable<Object>;

  @HostBinding('style.border-left-color') borderLeft;
  constructor() {
  }

  ngOnInit() {
    Observable
      .combineLatest(this.boardColorPrefs$, this.boards$)
      .subscribe(x => {
        let boardColorPrefs = x[0];
        let board = _.find(x[1], (board: Board) => board.id === this.card.idBoard);
        this.borderLeft = boardColorPrefs[this.card.idBoard] || (board ? board.prefs.backgroundColor : null);
      })
  }
}
