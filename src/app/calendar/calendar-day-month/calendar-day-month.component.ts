import {Component, OnInit, Input, Renderer, ElementRef, HostListener, OnDestroy} from '@angular/core';
import {CalendarDay} from '../../models/calendar-day';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {Card} from '../../models/card';
import * as moment from 'moment';
import * as _ from 'lodash';
import {CardActions} from '../../redux/actions/card-actions';
import {DragDropData} from 'ng2-dnd';
import {ContextMenuService} from '../context-menu-holder/context-menu.service';
import {selectVisibleCards} from '../../redux/store/selects';
import Dictionary = _.Dictionary;
import {DropZoneService} from '../../services/drop-zone.service';

@Component({
  selector: 'app-calendar-day-month',
  templateUrl: './calendar-day-month.component.html',
  styleUrls: ['./calendar-day-month.component.scss'],
})
export class CalendarDayForMonthComponent implements OnInit, OnDestroy {

  @select(selectVisibleCards) public cards$: Observable<Card[]>;
  @Input() public calendarDay: CalendarDay;
  public cards: Card[];
  private subscriptions: Subscription[] = [];

  constructor(public cardActions: CardActions,
              private renderer: Renderer,
              private element: ElementRef,
              private contextMenuService: ContextMenuService, private dropZoneService: DropZoneService) {
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
      this.renderer.setElementClass(this.element.nativeElement, 'offsetDay', true);
    }

    if (this.calendarDay.isToday) {
      this.renderer.setElementClass(this.element.nativeElement, 'today', true);
    }

    this.subscriptions.push(
      this.cards$.subscribe(
        cards => {
          this.cards = cards
            .filter(card => moment(card.due).isSame(this.calendarDay.date, 'day'))
            .sort((a, b) => {
              const cardADue = moment(a.due);
              const cardBADue = moment(b.due);
              if (cardADue.isBefore(cardBADue)) {
                return -1;
              }
              if (cardADue.isAfter(cardBADue)) {
                return 1;
              }

              return a.name.localeCompare(b.name);
            });
        }
      ));
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onDropSuccess(event: DragDropData) {
    let card: Card = event.dragData;

    let hours = 12, minutes = 0, seconds = 0;

    if (card.due) {
      hours = moment(card.due).hours();
      minutes = moment(card.due).minutes();
      seconds = moment(card.due).seconds();
    }

    let due = moment(this.calendarDay.date).hours(hours).minutes(minutes).seconds(seconds);
    this.cardActions.updateCardsDue(card.id, due.toDate());
  }

  dragStart($event: DragDropData) {
    this.dropZoneService.dragStart();
  }

  dragEnd($event: DragDropData) {
    this.dropZoneService.dragStop();
  }
}

