import {Component, OnInit} from '@angular/core';
import {Card} from "../../models/card";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {Board} from "../../models/board";
import {TrelloHttpService} from "../../services/trello-http.service";
import {Member} from "../../models/member";
import {List} from "../../models/list";
import * as moment from "moment";
import {MdDialogRef} from "@angular/material";


@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  public card: Card = new Card();
  public boards: Board[] = [];
  public members: Member[] = [];
  public lists: List[] = [];


  // those fields need to be transformed before save:
  public selectedMembers: string[];

  constructor(public dialogRef: MdDialogRef<AddCardComponent>, private tHttp: TrelloHttpService) {
    //todo update form to formbuilder + validation
  }

  @select("boards") public boards$: Observable<Board[]>;

  ngOnInit() {
    this.card.due = moment().format("YYYY-MM-DD HH:mm").replace(" ", "T");
    this.boards$.subscribe(
      boards => {
        this.boards = boards.filter(
          board => !board.closed
        );
      }
    );
  }

  selectedBoard(boardId: string) {
    this.tHttp.get("boards/" + boardId + "/members")
      .subscribe(
        success => this.members = success.json(),
        error => this.members = []
      );
    this.tHttp.get("boards/" + boardId + "/lists")
      .subscribe(
        success => this.lists = success.json(),
        error => this.lists = []
      );
  }

  onSubmit() {
    this.tHttp.post("cards/", Object.assign(this.card, {
      idMembers: this.selectedMembers.toString()
    }))
      .subscribe(
        success => this.dialogRef.close(true),
        error => console.log(error) // todo
      );
  }

}
