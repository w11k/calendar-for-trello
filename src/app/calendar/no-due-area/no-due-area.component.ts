import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Card} from '../../models/card';
import {select} from '@angular-redux/store';
import {selectVisibleCards} from '../../redux/store/selects';

@Component({
  selector: 'app-no-due-area',
  templateUrl: './no-due-area.component.html',
  styleUrls: ['./no-due-area.component.scss']
})
export class NoDueAreaComponent implements OnInit, OnDestroy {

  @select(selectVisibleCards) public cards$: Observable<Card[]>;
  private subscriptions: Subscription[] = [];
  public cards: Card[];
  public show = false;

  constructor() {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.cards$.subscribe(
        cards => this.cards = cards.filter(card => !card.due)
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
