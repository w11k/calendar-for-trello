import {Component, OnDestroy, OnInit} from '@angular/core';
import {Card} from '../../models/card';
import {select} from '@angular-redux/store';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {CalendarDay} from '../../models/calendar-day';
import {DateTimeFormatService} from '../../services/date-time-format.service';
import {DragDropData} from '@beyerleinf/ngx-dnd';
import {CardActions} from '../../redux/actions/card-actions';
import {WeekDaySlot} from './week-day-slot.model';
import {Settings} from '../../models/settings';
import {selectCalendarCards, selectCalendarDays} from '../../redux/store/selects';
import {DropZoneService} from '../../services/drop-zone.service';
import {format, getHours, getMinutes, getSeconds, isSameDay, setHours, startOfDay} from 'date-fns';
import {setTime} from '../../shared/date';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnInit, OnDestroy {

  public slots: WeekDaySlot[] = [];
  public cards: Card[];
  public cardHolder: Object; //  {key: Cards[]}
  @select(selectCalendarCards) public cards$: Observable<Card[]>;
  @select(selectCalendarDays) public calendarDays$: Observable<CalendarDay[]>;
  @select('settings') public settings$: Observable<Settings>;
  public settings: Settings = new Settings();
  public amountDays: number;
  private subscriptions: Subscription[] = [];

  constructor(private dateTimeFormatService: DateTimeFormatService,
              private cardActions: CardActions,
              private dropZoneService: DropZoneService) {
  }

  ngOnInit() {
    this.subscriptions.push(
      combineLatest(this.cards$, this.calendarDays$, this.settings$)
        .subscribe(x => {
          const cards: Card[] = x[0];
          const calendarDays: CalendarDay[] = x[1];
          this.amountDays = calendarDays.length;
          this.slots = [];
          this.createHours(calendarDays, cards);
          this.cardHolder = {};
        }));

    this.subscriptions.push(
      this.settings$.subscribe(
        settings => {
          this.settings = settings;
        }
      ));
  }

  onDropSuccess(event: DragDropData, slot: WeekDaySlot) {
    const card: Card = event.dragData;
    const minutes = getMinutes(card.due);
    const seconds = getSeconds(card.due);

    let hours;
    if (this.settings.weekViewShowHours) {
      hours = slot.hours;
    } else {
      hours = getHours(card.due);
    }

    const due = setTime(slot.calendarDay.date, hours, minutes, seconds);
    this.cardActions.updateCardsDue(card.id, due);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  dragStart($event: DragDropData) {
    this.dropZoneService.dragStart();
  }

  dragEnd($event: DragDropData) {
    this.dropZoneService.dragStop();
  }

  private createHours(calendarDays: CalendarDay[], cards: Card[]) {
    this.cardHolder = {};
    calendarDays.map(day => {
      this.cardHolder[format(day.date, 'MM-DD-YYYY')] = cards.filter(card => isSameDay(card.due, day.date));
      return day;
    });
    for (let i = 0; i < 24; i++) {
      calendarDays.forEach((calendarDay) => {
          const baseDate = setHours(startOfDay(calendarDay.date), i);
          this.slots.push(
            new WeekDaySlot(format(baseDate, this.dateTimeFormatService.getTimeFormat()),
              this.cardHolder[format(calendarDay.date, 'MM-DD-YYYY')]
                .filter(card => i === getHours(card.due))
                .sort((a, b) => a.name.localeCompare(b.name)),
              calendarDay,
              i
            ));
        }
      );
    }
  }
}
