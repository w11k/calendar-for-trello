import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Card} from "../../models/card";
import {select} from "ng2-redux";

@Component({
  selector: 'app-no-due-area',
  templateUrl: './no-due-area.component.html',
  styleUrls: ['./no-due-area.component.scss']
})
export class NoDueAreaComponent implements OnInit {

  constructor() {
  }

  @select("cards") public cards$: Observable<Card[]>;

  cards: Card[];

  ngOnInit() {
    this.cards$.subscribe(
      cards => this.cards = cards.filter(
        card => !card.due
      )
    );
  }

}
