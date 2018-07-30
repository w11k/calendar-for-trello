import { Component, OnInit } from '@angular/core';
import { MyEventsService } from './my-events.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/delay';
import { select } from '@angular-redux/store';
import { selectOpenBoards } from '../redux/store/selects';
import { Board } from '../models/board';
import { User } from '../models/user';
import { Member } from '../models/member';

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
  cardsToBeRequested: any[];

  requestInterval: number;
  numberOfRequest: number;
  cardPosition: number;
  spinner: boolean;
  intervalSubscription: Subscription;

  constructor(private myEventsService: MyEventsService) { }

  ngOnInit() {
    this.boards = [];
    this.members = [];
    this.inBox = [];
    this.outBox = [];
    this.memberNames = [];
    this.spinner = false;
    this.numberOfRequest = 30;
    this.requestInterval = 10000;
    this.user$.subscribe((u) => {
      this.user = u;
    })
  }

  initializeData() {
    this.boards$.subscribe((b) => {
      this.boards = b;
    });
    this.members$.subscribe((m) => {
      this.members = m;
    });
    let memberids = Object.keys(this.members);
    memberids.forEach((element, index) => {
      this.memberNames[index] = this.members[element].username;
    });
    this.cards$.subscribe((c) => {
      this.cards = c;
    });
  }

  startCardRequest() {
    this.initializeData();
    this.cardPosition = 0;
    this.inBox = [];
    this.outBox = [];
    this.spinner = true;
    this.cardsToBeRequested = [];
    this.requestCards();
    this.intervalSubscription = Observable.interval(this.requestInterval).subscribe(() => {
      this.requestCards();
    })
  }

  requestCards() {
    for (let i = 0; i < this.numberOfRequest; i++) {
      if (this.cards[this.cardPosition] != undefined && this.cards[this.cardPosition] != null) {
        this.cardsToBeRequested[i] = this.cards[this.cardPosition]
      }
      else {
        setTimeout(() => {
          this.spinner = false;
          i = this.numberOfRequest
          this.intervalSubscription.unsubscribe();
        }, 4000);
      }
      this.cardPosition++;
    }
    this.getCards().subscribe((card) =>
      this.checkInAndOutBox(card));
  }

  getCards(): Observable<any> {
    return Observable.of(this.cardsToBeRequested)
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