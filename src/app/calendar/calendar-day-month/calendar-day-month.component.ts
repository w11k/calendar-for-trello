import {Component, OnInit, Input, Renderer, ElementRef} from '@angular/core';
import {CalendarDay} from "../../models/calendar-day";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {Card} from "../../models/card";
import * as moment from "moment";
import * as _ from "lodash"
import Dictionary = _.Dictionary;
import {CardActions} from "../../redux/actions/card-actions";
import {DragDropData} from "ng2-dnd";

export let CalendarUiDateFormat: string = "DD-MM-YYYY";

@Component({
  selector: 'app-calendar-day-month',
  templateUrl: './calendar-day-month.component.html',
  styleUrls: ['./calendar-day-month.component.scss'],
})
export class CalendarDayForMonthComponent implements OnInit {
  @select("cards") public cards$: Observable<Card[]>;
  @select(state => state.settings.boardVisibilityPrefs) public boardVisibilityPrefs$: Observable<Object>;

  @Input() public calendarDay: CalendarDay;
  public cards: Card[];

  constructor(public cardActions: CardActions,
              private renderer: Renderer,
              private element: ElementRef) {
  }

  ngOnInit() {

    if (this.calendarDay.isDayOff) {
      this.renderer.setElementClass(this.element.nativeElement, "offsetDay", true);
    }

    if (this.calendarDay.isToday) {
      this.renderer.setElementClass(this.element.nativeElement, "today", true);
    }

    Observable
      .combineLatest(this.cards$, this.boardVisibilityPrefs$)
      .subscribe(x => {
        let cards: Card[] = x[0];
        let visibilityPrefs: Object = x[1];
        this.cards = cards.filter(
          card => moment(card.due).isSame(this.calendarDay.date, "day") && !visibilityPrefs[card.idBoard]
        )
      })
  }

  onDropSuccess(event: DragDropData) {
    let card: Card = event.dragData;
    let hours = moment(card.due).hours();
    let minutes = moment(card.due).minutes();
    let seconds = moment(card.due).seconds();
    let due = moment(this.calendarDay.date).hours(hours).minutes(minutes).seconds(seconds);
    this.cardActions.updateCardsDue(card.id, due.toDate())
  }
}

