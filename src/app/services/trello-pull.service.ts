import {Injectable} from '@angular/core';
import {CardActions} from "../redux/actions/card-actions";
import {BoardActions} from "../redux/actions/board-actions";
import {UserActions} from "../redux/actions/user-actions";
import {TrelloHttpService} from "./trello-http.service";
import {Board} from "../models/board";
import * as moment from "moment";
import {ListActions} from "../redux/actions/list-actions";

@Injectable()
export class TrelloPullService {
  private interval;
  private intervalTime = 30000;

  constructor(private tHttp: TrelloHttpService,
              public userActons: UserActions,
              public boardActions: BoardActions,
              public cardActions: CardActions,
              public listActions: ListActions) {
  }

  public pull = () => {
    this._fetchBoards();
    this._fetchUser();
  };


  public continuousFetch = () => {
    this.pull();
    this.interval = setInterval(this.pull, this.intervalTime);
  };

  private _fetchBoards = () => {
    this.tHttp.get("member/me/boards", null, "filter=open").subscribe(
      data => {
        let boards: Board[] = data.json();
        this.boardActions.loadBoards(boards);
        const toLoadBoards = this._checkBoards(boards);
        if (toLoadBoards) {
          this._loadCardsOfBoard(toLoadBoards);
        }
      },
      err => {
        // no token, do nothing;
      });

  };

  private _fetchUser = () => {
    this.tHttp.get("/members/me").subscribe(
      data => this.userActons.addUser(data.json()),
      error => console.log(error)
    )
  };


  // determines if each Board in an array is fresh (pulled)
  private _checkBoards = (boards: Board[]): Board[] => {
    return boards.filter(
      board => {
        if (board.lastPulledAt) {
          // board cards are already pulled
          return moment(board.lastPulledAt).isBefore(moment(board.dateLastActivity));
        } else {
          // board cards are yet not pulled, add it to toLoadBoardArray
          return true
        }
      });
  };

  private _loadCardsOfBoard(boards: Board[]) {
    boards.forEach(
      board => {
        // Fetch Cards of Board
        this.tHttp.get("boards/" + board.id + "/cards")
          .subscribe(
            response => this.cardActions.rebuildStorePartially(response.json(), board, new Date())
          );

        // Fetch Lists of Board
        this.tHttp.get("boards/" + board.id + "/lists")
          .subscribe(
            response => this.listActions.rebuildStorePartially(response.json(), board, new Date())
          );
      });
  }

}
