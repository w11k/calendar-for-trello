import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Card} from "../../models/card";
import {select} from "ng2-redux";
import {selectBoardColorPrefs} from "../../redux/store/selects";

@Component({
  selector: 'app-no-due-area',
  templateUrl: './no-due-area.component.html',
  styleUrls: ['./no-due-area.component.scss']
})
export class NoDueAreaComponent implements OnInit {

  constructor() {
  }

  @select(selectBoardColorPrefs) public boardVisibilityPrefs$: Observable<Object>;

  @select("cards") public cards$: Observable<Card[]>;

  cards: Card[];

  ngOnInit() {
    // this.cards$.subscribe(
    //   cards => this.cards = cards.filter(
    //     card => !card.due
    //   )
    // );
    Observable
      .combineLatest(this.cards$, this.boardVisibilityPrefs$)
      .subscribe(x => {
        let cards: Card[] = x[0];
        let visibilityPrefs: Object = x[1];
        this.cards = cards.filter(
          card => !card.due && !visibilityPrefs[card.idBoard]
        );
      })
  }

}
