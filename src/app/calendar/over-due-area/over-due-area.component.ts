import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Card} from "../../models/card";
import {select} from "ng2-redux";
import {Moment} from "moment";
import * as moment from "moment";
import {selectBoardColorPrefs, selectBoardVisibilityPrefs} from "../../redux/store/selects";

@Component({
  selector: 'app-over-due-area',
  templateUrl: './over-due-area.component.html',
  styleUrls: ['./over-due-area.component.scss']
})
export class OverDueAreaComponent implements OnInit {

  constructor() {
  }

  @select("cards") public cards$: Observable<Card[]>;

  cards: Card[];
  @select(selectBoardVisibilityPrefs) public boardVisibilityPrefs$: Observable<Object>;


  ngOnInit() {
    // this.cards$.subscribe(
    //   cards => this.cards = cards.filter(
    //     card => moment(card.due).isBefore(moment().hours(0).minutes(0).seconds(0).milliseconds(0))
    //   )
    // );
    Observable
      .combineLatest(this.cards$, this.boardVisibilityPrefs$)
      .subscribe(x => {
        let cards: Card[] = x[0];
        let visibilityPrefs: Object = x[1];
        this.cards = cards.filter(
          card => moment(card.due).isBefore(moment().hours(0).minutes(0).seconds(0).milliseconds(0)) && !visibilityPrefs[card.idBoard] && !card.dueComplete
        );
      })
  }
}
