import {Component, OnInit, Input} from '@angular/core';
import {CalendarDay} from "../../models/calendar-day";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {Card} from "../../models/card";
import {Moment} from "moment";
import * as moment from "moment";
import {DragulaService} from "ng2-dragula/components/dragula.provider";

export let CalendarUiDateFormat: string = "DD-MM-YYYY";

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
})
export class CalendarDayComponent implements OnInit {


  // id is currently required for drag and drop as date target. format is dd-mm-yyyy -> CalendarUiDateFormat
  id: string;
  @select("cards") public cards$: Observable<Card[]>;
  cards: Card[];

  public bagname: string;

  @Input() public calendarDay: CalendarDay;

  constructor() {
  }

  ngOnInit() {

    // this.bagname = "bag"+moment(this.calendarDay.date).format(CalendarUiDateFormat);  // bags name must be the same,.. for reasons.
    this.bagname = "bag";

    this.cards$.subscribe(
      cards => {
        this.cards = cards.filter(
          card => moment(card.due).isSame(this.calendarDay.date, "day")
        );
      }
    );
    this.id = moment(this.calendarDay.date).format(CalendarUiDateFormat)
  }
}
