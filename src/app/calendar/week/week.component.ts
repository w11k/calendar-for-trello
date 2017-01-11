import {Component, OnInit} from '@angular/core';
import * as moment from "moment";
import {Card} from "../../models/card";
import {select} from "ng2-redux";
import {Observable, Subscription} from "rxjs";
import {CalendarDay} from "../../models/calendar-day";
import {DateTimeFormatService} from "../../services/date-time-format.service";
import {DragDropData} from "ng2-dnd";
import {CardActions} from "../../redux/actions/card-actions";
import {WeekDaySlot} from "./WeekDaySlot";
import {selectBoardVisibilityPrefs, selectCalendarDays, selectSettingsLanguage} from "../../redux/store/selects";
import {Settings} from "../../models/settings";
import {User} from "../../models/user";

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnInit {

  private subscription: Subscription = null;
  public slots: WeekDaySlot[] = [];
  public cards: Card[];

  public cardHolder: Object; //  {key: Cards[]}

  @select("cards") public cards$: Observable<Card[]>;
  @select(selectBoardVisibilityPrefs) public boardVisibilityPrefs$: Observable<Object>;
  @select(selectCalendarDays) public calendar$: Observable<CalendarDay[]>;
  @select("settings") public settings$: Observable<Settings>;
  @select("user") public user$: Observable<User>;

  constructor(private dateTimeFormatService: DateTimeFormatService, private cardActions: CardActions) {


  }

  ngOnInit() {
    this.subscription = Observable
      .combineLatest(this.cards$, this.boardVisibilityPrefs$, this.calendar$, this.settings$, this.user$)
      .subscribe(x => {
        const cards: Card[] = x[0];
        const visibilityPrefs: Object = x[1];
        const calendarDays: CalendarDay[] = x[2];
        const settings: Settings = x[3];
        const user: User = x[4];

        if (calendarDays) {
          const filteredCards = cards.filter(this.filterFn.bind(this, settings, user));
          this.slots = [];
          this.createHours(calendarDays, visibilityPrefs, filteredCards, settings.language);
          this.cardHolder = {};
        }
      });
  }

  createHours = (calendarDays: CalendarDay[], visibilityPrefs: Object, cards: Card[], lang) => {
    this.cardHolder = {};
    calendarDays.map(day => {
      this.cardHolder[moment(day.date).format("MM-DD-YYYY")] = cards.filter(card => moment(card.due).isSame(day.date, "day") && !visibilityPrefs[card.idBoard])
      return day;
    });
    for (let i = 0; i < 24; i++) {
      calendarDays.forEach((calendarDay) => {
        let baseDate = moment(calendarDay.date).hours(i).minutes(0).seconds(0).milliseconds(0);
        this.slots.push(
          new WeekDaySlot(baseDate.format(this.dateTimeFormatService.getTimeFormat(lang)),
            this.cardHolder[moment(calendarDay.date).format("MM-DD-YYYY")].filter(card => i === moment(card.due).hour()),
            calendarDay,
            i
          ));
      })
    }
  };

  filterFn(settings: Settings, user: User, card: Card) {
    if (!settings.observerMode) {
      return card.idMembers.indexOf(user.id) > -1
    }
    return true
  }

  onDropSuccess(event: DragDropData, slot: WeekDaySlot) {
    let card: Card = event.dragData;
    let minutes = moment(card.due).minutes();
    let seconds = moment(card.due).seconds();
    let hours = slot.hours;
    let due = moment(slot.CalendarDay.date).hours(hours).minutes(minutes).seconds(seconds);
    this.cardActions.updateCardsDue(card.id, due.toDate())
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
