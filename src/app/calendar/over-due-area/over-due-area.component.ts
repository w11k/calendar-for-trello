import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Card} from '../../models/card';
import {select} from '@angular-redux/store';
import * as moment from 'moment';
import {selectVisibleCards} from '../../redux/store/selects';

@Component({
  selector: 'app-over-due-area',
  templateUrl: './over-due-area.component.html',
  styleUrls: ['./over-due-area.component.scss']
})
export class OverDueAreaComponent implements OnInit, OnDestroy {

  @select(selectVisibleCards) cards$: Observable<Card[]>;
  public show = false;
  cards: Card[];
  private subscriptions: Subscription[] = [];

  constructor() {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.cards$.subscribe(
        cards => this.cards = cards.filter(card => {
          return moment(card.due).isBefore(moment().hours(0).minutes(0).seconds(0).milliseconds(0))
            && !card.dueComplete;
        })
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
