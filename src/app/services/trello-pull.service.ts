import {Injectable} from '@angular/core';
import {CardActions} from "../redux/actions/card-actions";
import {BoardActions} from "../redux/actions/board-actions";
import {UserActions} from "../redux/actions/user-actions";
import {TrelloHttpService} from "./trello-http.service";
import {Board} from "../models/board";
import {Observable} from "rxjs";
import {Card} from "../models/card";
import {select} from "ng2-redux";
import {Settings} from "../models/settings";
import {Response} from "@angular/http";


@Injectable()
export class TrelloPullService {
  @select(state => state.settings) public settings$: Observable<Settings>;
  private settings: Settings = new Settings();

  constructor(private tHttp: TrelloHttpService,
              public userActons: UserActions,
              public boardActions: BoardActions,
              public cardActions: CardActions,) {
    this.settings$.subscribe(settings => this.settings = settings);
  }



  public pull() {
    this.tHttp.get("member/me/boards").subscribe(
      data => {
        let boards: Board[] = data.json();
        this.boardActions.loadBoards(boards);
        if (this.settings.observerMode) {
          this._pullAllCards(boards);
        }
      },
      error => console.log(error)
    );
    if (!this.settings.observerMode) {
      this.tHttp.get("member/me/cards").subscribe(
        data => this.cardActions.rebuildStore(data.json()),
        error => console.log(error)
      );
    }
    this.tHttp.get("/members/me").subscribe(
      data => this.userActons.addUser(data.json()),
      error => console.log(error)
    );
  }

  private _pullAllCards(boards: Board[]) {
    let activeBoards = boards.filter(board => !board.closed);
    this._pullAllBoards(activeBoards)
      .subscribe(
        responses => this.cardActions.rebuildStore(
          this._processAllBoardResponses(responses)
        ))
  };

  private _pullAllBoards(boards: Board[]): Observable<Response[]> {
    return Observable.forkJoin(boards.map(
      board => this.tHttp.get("boards/" + board.id + "/cards")
    ))
  }

  private _processAllBoardResponses(responses: Response[]): Card[] {
    return [].concat.apply([], responses.map((perBoardRequest: any) => {
      return <Card>perBoardRequest.json();
    }));
  }
}
