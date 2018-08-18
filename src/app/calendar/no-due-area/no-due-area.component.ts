import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Card} from '../../models/card';
import {select} from '@angular-redux/store';
import {selectNoDueCards} from '../../redux/store/selects';
import {untilComponentDestroyed} from 'ng2-rx-componentdestroyed';

@Component({
  selector: 'app-no-due-area',
  templateUrl: './no-due-area.component.html',
  styleUrls: ['./no-due-area.component.scss']
})
export class NoDueAreaComponent implements OnInit, OnDestroy {

  @select(selectNoDueCards) public cards$: Observable<Card[]>;
  public cards: Card[] = [];
  show: boolean;

  constructor() {
  }

  ngOnInit() {
    this.cards$
      .pipe(untilComponentDestroyed(this))
      .subscribe((cards: Card[]) => this.cards = cards);
  }

  ngOnDestroy() {
  }

}
