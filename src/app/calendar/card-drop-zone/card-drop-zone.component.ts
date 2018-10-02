import {Component, OnInit} from '@angular/core';
import {DragDropData} from '@beyerleinf/ngx-dnd';
import {CardActions} from '../../redux/actions/card-actions';
import {Card} from '../../models/card';
import {DropZoneService} from '../../services/drop-zone.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-card-drop-zone',
  templateUrl: './card-drop-zone.component.html',
  styleUrls: ['./card-drop-zone.component.scss']
})
export class CardDropZoneComponent implements OnInit {
  public show$: Observable<boolean>;

  constructor(public cardActions: CardActions, private dropZoneService: DropZoneService) {
  }

  ngOnInit() {
    this.show$ = this.dropZoneService.getUpdates();
  }

  removeDue(event: DragDropData) {
    const card: Card = event.dragData;
    this.cardActions.removeDue(card.id);
  }

  archiveCard(event: DragDropData) {
    const card: Card = event.dragData;
    this.cardActions.markCardDone(card);
    this.cardActions.archiveCard(card.id);
  }

  markDone(event: DragDropData) {
    const card: Card = event.dragData;
    this.cardActions.markCardDone(card);
  }

}
