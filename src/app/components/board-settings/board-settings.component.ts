import {Component, OnInit} from '@angular/core';
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {Board} from "../../models/board";

@Component({
  selector: 'app-board-settings',
  templateUrl: './board-settings.component.html',
  styleUrls: ['./board-settings.component.scss']
})
export class BoardSettingsComponent implements OnInit {

  boards: Board[];
  @select("boards") public boards$: Observable<Board[]>;

  constructor() {
  }

  ngOnInit() {
    this.boards$.subscribe(
      boards => {
        this.boards = boards
          .filter(board => !board.closed)
          .map(board => Object.assign({}, board));
      }
    );
  }
}

