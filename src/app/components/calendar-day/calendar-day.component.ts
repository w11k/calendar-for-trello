import {Component, OnInit, Input} from '@angular/core';
import {CalendarDay} from "../../models/calendar-day";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {Card} from "../../models/card";
import {Moment} from "moment";
import * as moment from "moment";
import Dictionary = _.Dictionary;
import {CardActions} from "../../redux/actions/card-actions";
import {DragDropData} from "ng2-dnd";

export let CalendarUiDateFormat: string = "DD-MM-YYYY";

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
})
export class CalendarDayComponent implements OnInit {
  @select("cards") public cards$: Observable<Card[]>;
  cards: Card[];
  @Input() public calendarDay: CalendarDay;

  constructor(public cardActions: CardActions) {
  }

  ngOnInit() {
    this.cards$.subscribe(
      cards => {
        this.cards = cards.filter(
          card => moment(card.due).isSame(this.calendarDay.date, "day")
        );
      }
    );
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
