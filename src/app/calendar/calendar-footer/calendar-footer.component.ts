import {Component, OnInit} from '@angular/core';
import {DragDropData} from 'ng2-dnd';
import {CardActions} from '../../redux/actions/card-actions';
import {Card} from '../../models/card';

@Component({
  selector: 'app-calendar-footer',
  templateUrl: './calendar-footer.component.html',
  styleUrls: ['./calendar-footer.component.scss']
})
export class CalendarFooterComponent implements OnInit {

  constructor(public cardActions: CardActions) {
  }

  ngOnInit() {
  }

  removeDue(event: DragDropData) {
    let card: Card = event.dragData;
    this.cardActions.removeDue(card.id);
  }

  archiveCard(event: DragDropData) {
    let card: Card = event.dragData;
    this.cardActions.archiveCard(card.id);
  }

  markDone(event: DragDropData) {
    let card: Card = event.dragData;
    this.cardActions.markCardDone(card);
  }

}
