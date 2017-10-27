import {Injectable, OnInit} from '@angular/core';
import {CardActions} from '../redux/actions/card-actions';
import {BoardActions} from '../redux/actions/board-actions';
import {UserActions} from '../redux/actions/user-actions';
import {TrelloHttpService} from './trello-http.service';
import {Board} from '../models/board';
import * as moment from 'moment';
import {ListActions} from '../redux/actions/list-actions';
import {Observable, Subject, ReplaySubject} from 'rxjs';
import {MemberActions} from '../redux/actions/member-actions';
import * as _ from 'lodash';
import {select} from '@angular-redux/store';
import {selectClosedBoards} from '../redux/store/selects';

@Injectable()
export class TrelloPullService {

  public loadingState$: Subject<boolean> = new ReplaySubject();

  @select(selectClosedBoards) private closedBoards$: Observable<Board[]>;
  private closedBoards: Board[];

  constructor(private tHttp: TrelloHttpService,
              public userActons: UserActions,
              public boardActions: BoardActions,
              public cardActions: CardActions,
              public listActions: ListActions,
              private memberActions: MemberActions) {
  }

  /*ngOnInit(): void {
    this.closedBoards$.subscribe(boards => {
      this.closedBoards = boards;
    });
  }*/

  public pull = () => {
    this.loadingState$.next(true);
    this._fetchBoards();
    this._fetchUser();
  }


  private _fetchBoards = () => {
    this.tHttp.get('member/me/boards', null).subscribe(
      data => {
        let boards: Board[] = data.json();

        let boardsGroupedByClosed = _.groupBy(boards, 'closed');

        let closedBoards = boardsGroupedByClosed['true'];

        if (closedBoards) {
          this._removeBoards(closedBoards);
        }

        let openBoards = boardsGroupedByClosed['false'];
        const toLoadBoards = this._checkBoards(openBoards);

        if (toLoadBoards && toLoadBoards.length) {


          this._loadCardsOfBoard(openBoards);
        } else {
          this.loadingState$.next(false);
        }

        this.boardActions.updateBoards(boards);
      },
      err => {
        // no token, do nothing;
      });

  }

  private _fetchUser = () => {
    this.tHttp.get('/members/me').subscribe(
      data => this.userActons.addUser(data.json()),
      error => console.log(error)
    );
  }


  // determines if each Board in an array is fresh (pulled)
  private _checkBoards = (boards: Board[]): Board[] => {
    return boards.filter(
      board => {
        if (board.lastPulledAt) {
          // board cards are already pulled
          return moment(board.lastPulledAt).isBefore(moment(board.dateLastActivity));
        } else {
          // board cards are yet not pulled, add it to toLoadBoardArray
          return true;
        }
      });
  }

  private _loadCardsOfBoard(boards: Board[]) {
    let delay = 50;

    function getDelay() {
      delay = delay * 1.15;
      if (delay > 1200) {
        return 1200;
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
      let boardRequest = this.tHttp.get('boards/' + board.id + '/cards');
      boardRequest
        .subscribe(
          response => {
            this.cardActions.rebuildStorePartially(response.json(), board, new Date());
          }
        );

      // Fetch Lists of Board
      let listRequest = this.tHttp.get('boards/' + board.id + '/lists');
      listRequest
        .subscribe(
          response => {
            this.listActions.rebuildStorePartially(response.json(), board, new Date());
          }
        );


      // Fetch Members of Board
      let memberRequest = this.tHttp.get('boards/' + board.id + '/members', null, 'fields=all');
      memberRequest
        .subscribe(
          response => {
            console.log(response.json());
            this.memberActions.rebuildStorePartially(response.json(), board, new Date());
          }
        );


      if (i === boards.length) {
        Observable
          .combineLatest(boardRequest, memberRequest)
          .subscribe(() => {
            // => this is last request
            this.loadingState$.next(false);
          });
      }
    });
  }

  private _removeBoards(closedBoards: Board[]) {

    this.closedBoards$.take(1).subscribe(closedBoardsStore => {

      //TODO jblankenhorn 27.10.17 # filter not working right ..
      let toCloseBoards = closedBoardsStore.filter(board => false === closedBoards.find(cb => cb.id === board.id));

      toCloseBoards.forEach(board => {
        this.cardActions.removeCardsByBoardId(board.id);
      });
      this.boardActions.removeBoards(toCloseBoards);
    });


  }
}
