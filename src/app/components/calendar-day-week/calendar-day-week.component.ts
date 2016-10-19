import {Component, OnInit, Input} from '@angular/core';
import {CalendarDay} from "../../models/calendar-day";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {Card} from "../../models/card";
import {Moment} from "moment";
import * as moment from "moment";
import {CalendarUiDateFormat} from "../calendar-day-month/calendar-day-month.component";
import {DragDropData} from "ng2-dnd";
import {CardActions} from "../../redux/actions/card-actions";
import {DateTimeFormatService} from "../../services/date-time-format.service";

@Component({
  selector: 'app-calendar-day-week',
  templateUrl: './calendar-day-week.component.html',
  styleUrls: ['./calendar-day-week.component.scss']
})
export class CalendarDayForWeekComponent implements OnInit {

  @select("cards") public cards$: Observable<Card[]>;
  @select(state => state.settings.boardVisibilityPrefs) public boardVisibilityPrefs$: Observable<Object>;

  @Input() public calendarDay: CalendarDay;
  public cards: Card[];
  public slots: WeekDaySlot[] = [];

  constructor(public cardActions: CardActions, private dateTimeFormatService: DateTimeFormatService) {
  }

  createHours(cards) {
    // todo move to service, should only run once not per component
    this.slots = [];
    let baseDate = moment(this.calendarDay.date).hours(0).minutes(0).seconds(0).milliseconds(0);
    for (let i = 0; i < 24; i++) {
      this.slots.push(new WeekDaySlot(baseDate.format(this.dateTimeFormatService.getTimeFormat()), cards.filter(
        card => moment(card.due).isSame(baseDate, "hour")
      )));
      baseDate.add(1, "hours");
    }
  }

  ngOnInit() {
    // this.cards$.subscribe(
    //   cards => {
    //     this.cards = cards.filter(
    //       card => moment(card.due).isSame(this.calendarDay.date, "day")
    //     );
    //     this.createHours(this.cards);
    //   }
    // );
    Observable
      .combineLatest(this.cards$, this.boardVisibilityPrefs$)
      .subscribe(x => {
        let cards: Card[] = x[0];
        let visibilityPrefs: Object = x[1];
        this.cards = cards.filter(
          card => moment(card.due).isSame(this.calendarDay.date, "day") && !visibilityPrefs[card.idBoard]
        );
        this.createHours(this.cards);
      })
  }
  onDropSuccess(event: DragDropData, time: string) {
    let card: Card = event.dragData;
    let minutes = moment(card.due).minutes();
    let seconds = moment(card.due).seconds();
    let hours = parseInt(time);
    let due = moment(this.calendarDay.date).hours(hours).minutes(minutes).seconds(seconds);
    this.cardActions.updateCardsDue(card.id, due.toDate())
  }

}

export class WeekDaySlot {
  constructor(public time: string,
              public cards: Card[]) {

  }
}
