import {Component, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {CalendarDay} from '../../models/calendar-day';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {Card} from '../../models/card';
import {CardActions} from '../../redux/actions/card-actions';
import {ContextMenuService} from '../context-menu-holder/context-menu.service';
import {selectCalendarCards} from '../../redux/store/selects';
import {DropZoneService} from '../../services/drop-zone.service';
import {DragDropData} from '@beyerleinf/ngx-dnd';
import {getHours, getMinutes, getSeconds, setHours, setMinutes, setSeconds} from 'date-fns';

@Component({
  selector: 'app-calendar-day-month',
  templateUrl: './calendar-day-month.component.html',
  styleUrls: ['./calendar-day-month.component.scss'],
})
export class CalendarDayForMonthComponent implements OnInit, OnDestroy {

  @select(selectCalendarCards) public cards$: Observable<Card[]>;
  @Input() public calendarDay: CalendarDay;
  @Input() public cards;

  constructor(public cardActions: CardActions,
              private element: ElementRef,
              private contextMenuService: ContextMenuService, private dropZoneService: DropZoneService) {
  }


  @HostListener('contextmenu', ['$event'])
  onOpenContext(event: MouseEvent) {
    if (!this.contextMenuService.registration) { // disabled for now, remove to activte !
      event.preventDefault();
      const left = event.pageX;
      const top = event.pageY;
      this.contextMenuService.registration.move(left, top);
    }
  }

  ngOnInit() {
  }


  ngOnDestroy() {
  }

  onDropSuccess(event: DragDropData) {
    const card: Card = event.dragData;

    let hours = 12, minutes = 0, seconds = 0;

    if (card.due) {
      hours = getHours(card.due);
      minutes = getMinutes(card.due);
      seconds = getSeconds(card.due);
    }

    const due = setSeconds(setMinutes(setHours(this.calendarDay.date, hours), minutes), seconds);
    this.cardActions.updateCardsDue(card.id, due);
  }

  dragStart($event: DragDropData) {
    this.dropZoneService.dragStart();
  }

  dragEnd($event: DragDropData) {
    this.dropZoneService.dragStop();
  }
}

