import {Component, OnDestroy, OnInit} from '@angular/core';
import {Card} from '../../models/card';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {Board} from '../../models/board';
import {TrelloHttpService} from '../../services/trello-http.service';
import {Member} from '../../models/member';
import {List} from '../../models/list';
import {MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {selectOpenBoards} from '../../redux/store/selects';
import {format, setHours, setMinutes} from 'date-fns';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit, OnDestroy {

  public card: Card = new Card();
  public boards: Board[] = [];
  public members: Member[] = [];
  public lists: List[] = [];
  public cardForm: FormGroup;
  private subscriptions: Subscription[] = [];
  public clicked: boolean;
  @select(selectOpenBoards) public boards$: Observable<Board[]>;

  constructor(public dialogRef: MatDialogRef<AddCardComponent>, private tHttp: TrelloHttpService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.subscriptions.push(this.boards$.subscribe(boards => this.boards = boards));
    this.clicked = false;

    this.cardForm = this.formBuilder.group({
      name: [this.card ? this.card.name : '', Validators.required],
      due: [this.card && this.card.due ? this.card.due : new Date(), []],
      dueDate: [this.card && this.card.due ? this.card.due : new Date(), []],
      dueTime: [this.card && this.card.due ? this.card.due : format(new Date(), 'HH:mm'), []],
      desc: [this.card && this.card.desc ? this.card.desc : ''],
      idBoard: [this.card && this.card.idBoard ? this.card.idBoard : null, [Validators.required]],
      idList: [this.card && this.card.idList ? this.card.idList : null, [Validators.required]],
      idMembers: [this.card && this.card.idMembers ? this.card.idList : []],
    });


    this.subscriptions.push(this.cardForm.get('idBoard').valueChanges.subscribe(boardId => {

      // reset values
      this.members = [];
      this.lists = [];
      this.cardForm.get('idList').setValue(null);
      this.cardForm.get('idMembers').setValue(null);


      this.tHttp.get<Member[]>('boards/' + boardId + '/members')
        .subscribe(
          success => this.members = success,
          error => this.members = []
        );
      this.tHttp.get<List[]>('boards/' + boardId + '/lists')
        .subscribe(
          success => this.lists = success,
          error => this.lists = []
        );
    }));

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  onSubmit(cardForm: FormGroup) {
    this.clicked = true;
    if (cardForm && cardForm.valid) {
      let hours = 12;
      let minutes = 0;
      try {
        hours = +(cardForm.value.dueTime as string).split(':')[0] || hours;
        minutes = +(cardForm.value.dueTime as string).split(':')[1] || minutes;
      } catch (e) {
      }

      cardForm.value.due = setHours(setMinutes(cardForm.value.dueDate, minutes), hours);

      this.tHttp.post('cards/', cardForm.value)
        .subscribe(
          success => this.dialogRef.close(true),
          error => {
            throw new Error(error);
          }
        );
    }
  }

}
