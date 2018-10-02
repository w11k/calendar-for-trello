import {Injectable} from '@angular/core';
import {CardActions} from '../redux/actions/card-actions';
import {BoardActions} from '../redux/actions/board-actions';
import {UserActions} from '../redux/actions/user-actions';
import {TrelloHttpService} from './trello-http.service';
import {Board} from '../models/board';
import {ListActions} from '../redux/actions/list-actions';
import {Observable} from 'rxjs';
import {MemberActions} from '../redux/actions/member-actions';
import {select} from '@angular-redux/store';
import {selectBoards} from '../redux/store/selects';
import {take} from 'rxjs/operators';
import {User} from '../models/user';
import {Card} from '../models/card';
import {List} from '../models/list';
import {Member} from '../models/member';
import {HttpParams} from '@angular/common/http';
import {isBefore} from 'date-fns';

@Injectable()
export class TrelloPullService {

  @select(selectBoards) private allBoards$: Observable<Board[]>;

  constructor(private tHttp: TrelloHttpService,
              public userActons: UserActions,
              public boardActions: BoardActions,
              public cardActions: CardActions,
              public listActions: ListActions,
              private memberActions: MemberActions) {
  }

  public pull() {
    this._fetchBoards();
    this._fetchUser();
  }

  private _fetchBoards() {
    this.tHttp.get<Board[]>('member/me/boards', null).subscribe(
      boards => {

        // first, remove boards, because otherwise the change in the closed property is not recognized
        this._removeBoards(boards);
        this.boardActions.updateBoards(boards);

        const openBoards = boards.filter(it => !it.closed);
        const toLoadBoards = this._checkBoards(openBoards);

        if (toLoadBoards && toLoadBoards.length) {
          this._loadCardsOfBoard(toLoadBoards);
        }
      },
      err => {
        // no token, do nothing;
      });

  }

  // determines if each Board in an array is fresh (pulled)
  private _checkBoards(boards: Board[]): Board[] {
    const now = new Date();
    return boards.filter(
      board => {
        if (board.lastPulledAt) {
          // board cards are already pulled
          return isBefore(board.lastPulledAt, board.dateLastActivity);
        } else {
          // board cards are yet not pulled, add it to toLoadBoardArray
          return true;
        }
      });
  }

  private _fetchUser() {
    this.tHttp.get<User>('/members/me').subscribe(
      data => this.userActons.addUser(data),
      error => console.error(error)
    );
  }

  private _loadCardsOfBoard(boards: Board[]) {

    boards.forEach((board) => {
      // i++;
      // Fetch Cards of Board
      const boardRequest = this.tHttp.get<Card[]>('boards/' + board.id + '/cards');
      boardRequest
        .subscribe(
          response => {
            this.cardActions.rebuildStorePartially(response, board, new Date());
          }
        );

      // Fetch Lists of Board
      const listRequest = this.tHttp.get<List[]>('boards/' + board.id + '/lists');
      listRequest
        .subscribe(
          response => {
            this.listActions.rebuildStorePartially(response, board, new Date());
          }
        );


      // Fetch Members of Board
      const params = new HttpParams().append('fields', 'all');
      const memberRequest = this.tHttp.get<Member[]>('boards/' + board.id + '/members', params);
      memberRequest
        .subscribe(
          response => {
            this.memberActions.rebuildStorePartially(response, board, new Date());
          }
        );

    });
  }

  /**
   * not the nicest way, of how to remove Boards.
   * The problem is, boards can either be closed, or completely removed
   * Closed Boards, are still sent from trello, with the property closed = true
   * But deleted boards are not sent at all ...
   */
  private _removeBoards(allBoardsFromTrello: Board[]) {

    this.allBoards$.pipe(take(1)).subscribe(boardsFromStore => {
      // console.log('boardsFromStore');
      // console.log(boardsFromStore);

      // Board has to be closed if
      // open -> closed
      // not sent from trello

      const toCloseBoards = boardsFromStore.filter(board => {

        // board was already closed ... do nothing
        if (board.closed === true) {
          return false;
        }

        // board was active, find the matching board sent from trello
        const boardFromTrello = allBoardsFromTrello.find(boardFromStore => boardFromStore.id === board.id);

        if (boardFromTrello) {
          // board was closed in trello
          if (boardFromTrello.closed === true) {
            return true;
          } else {
            return false;
          }
          // board was not sent from trello anymore ... must have been deleted
        } else {
          return true;
        }
      });

      // console.log('toCloseBoards');
      // console.log(toCloseBoards);

      if (toCloseBoards.length > 0) {
        // console.log('Removing ' + toCloseBoards.length + ' boards.');
        toCloseBoards.forEach(board => {
          this.cardActions.removeCardsByBoardId(board.id);
        });
        this.boardActions.removeBoards(toCloseBoards);
      }

    });
  }
}
