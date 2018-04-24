import {Component, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {Card} from '../../models/card';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {CalendarDay} from '../../models/calendar-day';
import {DateTimeFormatService} from '../../services/date-time-format.service';
import {DragDropData} from 'ng2-dnd';
import {CardActions} from '../../redux/actions/card-actions';
import {WeekDaySlot} from '../week/WeekDaySlot';
import {Settings} from '../../models/settings';
import {selectCalendarDays, selectSettingsLanguage, selectVisibleCards} from '../../redux/store/selects';
import {DropZoneService} from '../../services/drop-zone.service';

@Component({
  selector: 'app-work-week',
  templateUrl: './work-week.component.html',
  styleUrls: ['./work-week.component.scss']
})
export class WorkWeekComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public slots: WeekDaySlot[] = [];
  public cards: Card[];

  public cardHolder: Object; //  {key: Cards[]}

  @select(selectVisibleCards) public cards$: Observable<Card[]>;
  @select(selectCalendarDays) public calendar$: Observable<CalendarDay[]>;
  @select(selectSettingsLanguage) public lang$: Observable<string>;

  @select('settings') public settings$: Observable<Settings>;
  public settings: Settings = new Settings();

  constructor(private dateTimeFormatService: DateTimeFormatService, private cardActions: CardActions, private dropZoneService: DropZoneService) {
  }

  ngOnInit() {
    this.subscriptions.push(Observable
      .combineLatest(this.cards$, this.calendar$, this.lang$)
      .subscribe(x => {
        const cards: Card[] = x[0];
        const calendarDays: CalendarDay[] = x[1];
        const language: string = x[2];
        this.slots = [];
        this.createHours(calendarDays, cards, language);
        this.cardHolder = {};
      }));

    this.subscriptions.push(
      this.settings$.subscribe(
        settings => {
          this.settings = settings;
          moment.locale(settings.language);
        }
      ));
  }

  createHours = (calendarDays: CalendarDay[], cards: Card[], lang) => {
    this.cardHolder = {};
    console.log('calendarDays', calendarDays);
    calendarDays.map(day => {
      this.cardHolder[moment(day.date).format('MM-DD-YYYY')] = cards.filter(card => moment(card.due).isSame(day.date, 'day'));
      return day;
    });
    for (let i = 0; i < 24; i++) {
      calendarDays.forEach((calendarDay) => {
          const baseDate = moment(calendarDay.date).hours(i).minutes(0).seconds(0).milliseconds(0);
          this.slots.push(
            new WeekDaySlot(baseDate.format(this.dateTimeFormatService.getTimeFormat(lang)),
              this.cardHolder[moment(calendarDay.date).format('MM-DD-YYYY')]
                .filter(card => i === moment(card.due).hour())
                .sort((a, b) => a.name.localeCompare(b.name)),
              calendarDay,
              i
            ));
        }
      );
    }
  };

  onDropSuccess(event: DragDropData, slot: WeekDaySlot) {
    const card: Card = event.dragData;
    const minutes = moment(card.due).minutes();
    const seconds = moment(card.due).seconds();

    let hours;
    if (this.settings.weekViewShowHours) {
      hours = slot.hours;
    } else {
      hours = moment(card.due).hours();
    }

    const due = moment(slot.CalendarDay.date).hours(hours).minutes(minutes).seconds(seconds);
    this.cardActions.updateCardsDue(card.id, due.toDate());
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
}
