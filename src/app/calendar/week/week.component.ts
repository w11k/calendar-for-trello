import {Component, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {Card} from '../../models/card';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {CalendarDay} from '../../models/calendar-day';
import {DateTimeFormatService} from '../../services/date-time-format.service';
import {DragDropData} from 'ng2-dnd';
import {CardActions} from '../../redux/actions/card-actions';
import {WeekDaySlot} from './WeekDaySlot';
import {selectCalendarDays, selectSettingsLanguage, selectVisibleCards} from '../../redux/store/selects';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnInit, OnDestroy {

  private subscription: Subscription = null;
  public slots: WeekDaySlot[] = [];
  public cards: Card[];

  public cardHolder: Object; //  {key: Cards[]}

  @select(selectVisibleCards) public cards$: Observable<Card[]>;
  @select(selectCalendarDays) public calendar$: Observable<CalendarDay[]>;
  @select(selectSettingsLanguage) public lang$: Observable<string>;

  constructor(private dateTimeFormatService: DateTimeFormatService, private cardActions: CardActions) {
  }

  ngOnInit() {
    this.subscription = Observable
      .combineLatest(this.cards$, this.calendar$, this.lang$)
      .subscribe(x => {
        const cards: Card[] = x[0];
        const calendarDays: CalendarDay[] = x[1];
        const language: string = x[2];
        this.slots = [];
        this.createHours(calendarDays, cards, language);
        this.cardHolder = {};
      });
  }

  createHours = (calendarDays: CalendarDay[], cards: Card[], lang) => {
    this.cardHolder = {};
    calendarDays.map(day => {
      this.cardHolder[moment(day.date).format('MM-DD-YYYY')] = cards.filter(card => moment(card.due).isSame(day.date, 'day'));
      return day;
    });
    for (let i = 0; i < 24; i++) {
      calendarDays.forEach((calendarDay) => {
        let baseDate = moment(calendarDay.date).hours(i).minutes(0).seconds(0).milliseconds(0);
        this.slots.push(
          new WeekDaySlot(baseDate.format(this.dateTimeFormatService.getTimeFormat(lang)),
            this.cardHolder[moment(calendarDay.date).format('MM-DD-YYYY')]
              .filter(card => i === moment(card.due).hour())
              .sort((a, b) => a.name.localeCompare(b.name)),
            calendarDay,
            i
          ));
      });
    }
  }

  onDropSuccess(event: DragDropData, slot: WeekDaySlot) {
    let card: Card = event.dragData;
    let minutes = moment(card.due).minutes();
    let seconds = moment(card.due).seconds();
    let hours = slot.hours;
    let due = moment(slot.CalendarDay.date).hours(hours).minutes(minutes).seconds(seconds);
    this.cardActions.updateCardsDue(card.id, due.toDate());
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
