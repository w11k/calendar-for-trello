import { Card } from './../models/card';
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
import { take } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import { of } from 'rxjs/observable/of';

export interface Request {
  type: 'user' | 'card';
  id: string;
}

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})

export class MyEventsComponent implements OnInit {

  @select(selectOpenBoards) public boards$: Observable<Board[]>;
  @select('user') public user$: Observable<User>;
  @select('members') public members$: Observable<Member[]>;
  @select('cards') public cards$: Observable<Card[]>;

  user: User;
  members: any;
  memberNames: any[];
  boards: any[];
  inBox: any[];
  outBox: any[];
  cards = new Map<string, Card>();
  cardsToBeRequested: any[];

  cardCount: number;
  userCount: number;
  requestInterval: number;
  numberOfRequest: number;
  spinnerCard: boolean;
  spinnerUser: boolean;
  userSpinnerCount: number;
  cardSpinnerCount: number;
  intervalSubscription: Subscription;
  requests: Request[];
  cardArray: any[];

  constructor(private myEventsService: MyEventsService) { }

  ngOnInit() {

    this.cardArray = [];
    this.requests = [];
    this.members = [];
    this.inBox = [];
    this.outBox = [];
    this.memberNames = [];
    this.spinnerCard = false;
    this.spinnerUser = true;
    this.userSpinnerCount = 0;
    this.cardSpinnerCount = 0;
    this.cardCount = 0;
    this.userCount = 0;
    this.numberOfRequest = 30;
    this.requestInterval = 10000;

    this.user$.subscribe((u) => {
      this.user = u;
    });
    this.requests.push({ 'type': 'user', 'id': this.user.username });
    this.members$
      .pipe(take(1))
      .subscribe((m) => {
        this.members = m;
      });
    const memberIds = Object.keys(this.members);
    memberIds.forEach((element, index) => {
      this.memberNames[index] = this.members[element].username;
      if (this.members[element].username !== this.user.username) {
        this.requests.push({ 'type': 'user', 'id': this.members[element].username });
      }
    });

    this.requestInterval = 0;
    this.requestData();
  }

  requestData() {

    this.intervalSubscription = interval(this.requestInterval).subscribe(() => {
      this.requestInterval = 10000;
      this.cardsToBeRequested = [];

      for (let i = 0; i < this.numberOfRequest; i++) {

        if (this.requests[i] !== undefined) {

          if (this.requests[i].type === 'user') {
            this.myEventsService.getCardsByUser(this.requests[i].id).pipe(take(1)).subscribe((e) => {
              e['cards'].filter(x => this.cards.set(x.id, x));
              this.userCount++;
              this.userSpinnerCount++;
            });
          }

          if (this.requests[i].type === 'card') {
            this.cardsToBeRequested.push(this.cardArray[i][1]);
            this.cardCount++;
            this.cardSpinnerCount++;
            delete (this.cardArray[i])
          }

          delete (this.requests[i]);
        }
        else { break; }

      }

      if (this.userCount === this.numberOfRequest || this.userCount === this.requests.length) {
        this.userCount = 0;
        this.requests.splice(0, this.numberOfRequest);
      }

      if (this.cardCount === this.numberOfRequest || this.cardCount === this.requests.length) {
        this.cardCount = 0;
        this.requests.splice(0, this.numberOfRequest);
        this.cardArray.splice(0, this.numberOfRequest);
        this.getCards().subscribe((card) =>
          this.checkInAndOutBox(card));
      }

      if (this.requests.length === 0) {
        this.spinnerCard = false;
        this.spinnerUser = false;
        this.intervalSubscription.unsubscribe();
      }
    });
  }

  startCardRequest() {
    this.cardSpinnerCount = 0;
    this.cardCount = 0;
    this.requests = [];
    this.inBox = [];
    this.outBox = [];
    this.spinnerCard = true;
    this.cardsToBeRequested = [];

    this.cardArray = Array.from(this.cards);
    this.cardArray.forEach(element => {
      if (element !== undefined && element !== null) {
        this.requests.push({ 'type': 'card', 'id': element[0] });
      }
    });

    this.requestData();
  }

  getCards(): Observable<any> {
    return of(this.cardsToBeRequested)
      .pipe(
        switchMap((result: any[]) => {

          const observables = result.map(card =>
            Observable.combineLatest(of(card), this.myEventsService.getCommentCards(card.id))
          );
          return Observable.combineLatest(observables);

        })
      );
  }

  checkInAndOutBox(cards: any) {
    for (const card of cards) {
      if (card[1].length > 0) {

        if (card[1][0]['data']['text'].includes('@' + this.user.username)) {
          this.inBox.push(card);
        }

        const index = this.memberNames.indexOf(this.user.username, 0);
        if (index > -1) {
          this.memberNames.splice(index, 1);
        }
        for (const name of this.memberNames) {
          if (card[1][0]['data']['text'].includes('@' + name) && card[1][0].idMemberCreator === this.user.id) {
            this.outBox.push(card);
          }
        }

      }
    }
    // Sort arrays by date
    this.inBox.sort(function (a, b) {
      return new Date(b[1][0].date).getTime() - new Date(a[1][0].date).getTime();
    });
    this.outBox.sort(function (a, b) {
      return new Date(b[1][0].date).getTime() - new Date(a[1][0].date).getTime();
    });
  }

}
