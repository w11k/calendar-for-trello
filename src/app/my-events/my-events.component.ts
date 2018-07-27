import { switchMap, map } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';
import { MyEventsService } from './my-events.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';
import { selectOpenBoards } from '../redux/store/selects';
import { Board } from '../models/board';
import { User } from '../models/user';
import { Member } from '../models/member';
import { Card } from '../models/card';


@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {


  @select(selectOpenBoards) public boards$: Observable<Board[]>;
  @select('user') public user$: Observable<User>;
  @select('members') public members$: Observable<Member>;
  @select('cards') public cards$: Observable<any>;

  user: User;
  members: any;
  memberNames: any[];
  boards: any[];
  inBox: any[];
  outBox: any[];
  cards: any[];
  constructor(private myEventsService: MyEventsService) {

  }

  ngOnInit() {

    this.boards = [];
    this.members = [];
    this.inBox = [];
    this.outBox = [];
    this.memberNames = [];

    this.boards$.subscribe((b) => {
      this.boards = b;
    });
    this.user$.subscribe((u) => {
      this.user = u;
    })
    this.members$.subscribe((m) => {
      this.members = m;
    });

    let memberids = Object.keys(this.members);
    memberids.forEach((element, index) => {
      this.memberNames[index] = this.members[element].username;
    });

    this.cards$.subscribe((c) => {
    });
    this.getCards().subscribe((e) => {
      this.cards = e;
      this.checkInAndOutBox(this.cards);
    })
  }

  getCards(): Observable<any> {
    return this.cards$
      .pipe(
        switchMap((result: any[]) => {

          const observables = result.map(card =>

            Observable.combineLatest(Observable.of(card), this.myEventsService.getCommentCards(card.id))

          );
          return Observable.combineLatest(observables)
        })
      )
  }

  checkInAndOutBox(cards: any) {

    for (let card of cards) {
      if (card[1].length > 0) {

        if (card[1][0]['data']['text'].includes('@' + this.user.username)) {
          this.inBox.push(card);
        }

        let index = this.memberNames.indexOf(this.user.username, 0);
        if (index > -1) {
          this.memberNames.splice(index, 1);
        }

        for (let name of this.memberNames) {
          if (card[1][0]['data']['text'].includes('@' + name) && card[1][0].idMemberCreator == this.user.id) {
            this.outBox.push(card);
          }
        }
      }
    }

    //Sort arrays by date
    this.inBox.sort(function (a, b) {
      return new Date(b[1][0].date).getTime() - new Date(a[1][0].date).getTime();
    });
    this.outBox.sort(function (a, b) {
      return new Date(b[1][0].date).getTime() - new Date(a[1][0].date).getTime();
    });
  }
}