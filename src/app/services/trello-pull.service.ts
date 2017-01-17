import {Injectable} from "@angular/core";
import {CardActions} from "../redux/actions/card-actions";
import {BoardActions} from "../redux/actions/board-actions";
import {UserActions} from "../redux/actions/user-actions";
import {TrelloHttpService} from "./trello-http.service";
import {Board} from "../models/board";
import * as moment from "moment";
import {ListActions} from "../redux/actions/list-actions";
import {Observable, Subject, ReplaySubject} from "rxjs";

@Injectable()
export class TrelloPullService {
  public loadingState$: Subject<boolean> = new ReplaySubject();

  constructor(private tHttp: TrelloHttpService,
              public userActons: UserActions,
              public boardActions: BoardActions,
              public cardActions: CardActions,
              public listActions: ListActions) {
  }

  public pull = () => {
    this.loadingState$.next(true);
    this._fetchBoards();
    this._fetchUser();
  };


  private _fetchBoards = () => {
    this.tHttp.get("member/me/boards", null, "filter=open").subscribe(
      data => {
        let boards: Board[] = data.json();
        this.boardActions.loadBoards(boards);
        const toLoadBoards = this._checkBoards(boards);
        if (toLoadBoards && toLoadBoards.length) {
          this._loadCardsOfBoard(toLoadBoards);
        } else {
          this.loadingState$.next(false);
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
    let delay = 50;

    function getDelay() {
      delay = delay * 1.10;
      if (delay > 800) {
        return 800;
      }
      return delay;
    }

    let i = 0;

    let delayedBoards$ = Observable
      .from(boards)
      .concatMap(event => Observable.timer(getDelay()).map(() => event));

    delayedBoards$.subscribe((board) => {
      i++;
      // Fetch Cards of Board
      let boardRequest = this.tHttp.get("boards/" + board.id + "/cards");
      boardRequest
        .subscribe(
          response => {
            this.cardActions.rebuildStorePartially(response.json(), board, new Date())
          }
        );

      // Fetch Lists of Board
      let listRequest = this.tHttp.get("boards/" + board.id + "/lists");
      listRequest
        .subscribe(
          response => {
            this.listActions.rebuildStorePartially(response.json(), board, new Date())
          }
        );


      if (i === boards.length) {
        Observable
          .combineLatest(boardRequest, listRequest)
          .subscribe(() => {
            // => this is last request
            this.loadingState$.next(false)
          })
      }
    });
  }

}
