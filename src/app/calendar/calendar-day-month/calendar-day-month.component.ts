import {Component, OnInit, Input, Renderer, ElementRef, HostListener} from '@angular/core';
import {CalendarDay} from "../../models/calendar-day";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {Card} from "../../models/card";
import * as moment from "moment";
import * as _ from "lodash"
import Dictionary = _.Dictionary;
import {CardActions} from "../../redux/actions/card-actions";
import {DragDropData} from "ng2-dnd";
import {Settings} from "../../models/settings";
import {User} from "../../models/user";
import {ContextMenuService} from "../context-menu-holder/context-menu.service";

export let CalendarUiDateFormat: string = "DD-MM-YYYY";

@Component({
  selector: 'app-calendar-day-month',
  templateUrl: './calendar-day-month.component.html',
  styleUrls: ['./calendar-day-month.component.scss'],
})
export class CalendarDayForMonthComponent implements OnInit {
  @select("cards") public cards$: Observable<Card[]>;
  @select("user") public user$: Observable<User[]>;
  @select("settings") public settings$: Observable<Settings>;

  @Input() public calendarDay: CalendarDay;
  public cards: Card[];

  constructor(public cardActions: CardActions,
              private renderer: Renderer,
              private element: ElementRef,
              private contextMenuService: ContextMenuService) {
  }


  @HostListener('contextmenu', ['$event'])
  onOpenContext(event: MouseEvent) {
    if (!this.contextMenuService.registration) { // disabled for now, remove to activte !
      event.preventDefault();
      let left = event.pageX;
      let top = event.pageY;
      this.contextMenuService.registration.move(left, top);
    }
  }

  ngOnInit() {

    if (this.calendarDay.isDayOff) {
      this.renderer.setElementClass(this.element.nativeElement, "offsetDay", true);
    }

    if (this.calendarDay.isToday) {
      this.renderer.setElementClass(this.element.nativeElement, "today", true);
    }

    Observable
      .combineLatest(this.cards$, this.settings$, this.user$)
      .subscribe(x => {
        let cards: Card[] = x[0];
        const settings = x[1];
        const user = x[2];
        this.cards = cards.filter(
          card => moment(card.due).isSame(this.calendarDay.date, "day") && !settings.boardVisibilityPrefs[card.idBoard]
        ).filter(this.filterFn.bind(this, settings, user))
      })
  }

  filterFn(settings: Settings, user: User, card: Card) {
    if (!settings.observerMode) {
      return card.idMembers.indexOf(user.id) > -1
    }
    return true
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

