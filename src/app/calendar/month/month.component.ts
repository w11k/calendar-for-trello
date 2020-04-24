import {Component, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {selectCalendarCards, selectCalendarDays, selectSettingsShowWeekend} from '../../redux/store/selects';
import {combineLatest, Observable} from 'rxjs';
import {CalendarDay} from '../../models/calendar-day';
import {untilComponentDestroyed} from 'ng2-rx-componentdestroyed';
import {Card} from '../../models/card';
import groupBy from 'lodash/groupBy';
import {compareAsc, startOfDay} from 'date-fns';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit, OnDestroy {

  @select(selectCalendarDays) public calendarDays$: Observable<CalendarDay[]>;
  @select(selectSettingsShowWeekend) public showWeekend$: Observable<boolean>;
  @select(selectCalendarCards) public cards$: Observable<Card[]>;

  public amountDays: number;
  public daysWithCards;

  constructor() {
  }

  ngOnInit() {
    this.cards$
      .pipe(
        map((cards: Card[]) => cards.sort((a, b) => compareAsc(a.due, b.due))
        ))
      .subscribe(cardsOfMonth => {
        this.daysWithCards = groupBy(cardsOfMonth, (card) => startOfDay(card.due).getTime());
      });

    combineLatest(this.showWeekend$)
      .pipe(untilComponentDestroyed(this))
      .subscribe(value => {
        this.amountDays = value[0] ? 7 : 5;

      });
  }

  public getCardsOf(day: CalendarDay) {
    if (this.daysWithCards) {
      const time = startOfDay(day.date).getTime();
      const withCard = this.daysWithCards[time];
      return withCard;
    }
  }

  ngOnDestroy(): void {
  }

}
