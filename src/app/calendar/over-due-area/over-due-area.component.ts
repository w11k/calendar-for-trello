import {Component, OnInit} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {Card} from "../../models/card";
import {select} from "ng2-redux";
import * as moment from "moment";
import {selectBoardVisibilityPrefs} from "../../redux/store/selects";
import {Settings} from "../../models/settings";
import {User} from "../../models/user";

@Component({
  selector: 'app-over-due-area',
  templateUrl: './over-due-area.component.html',
  styleUrls: ['./over-due-area.component.scss']
})
export class OverDueAreaComponent implements OnInit {

  @select("cards") public cards$: Observable<Card[]>;
  @select(selectBoardVisibilityPrefs) public boardVisibilityPrefs$: Observable<Object>;
  @select("user") public user$: Observable<User>;
  @select("settings") public settings$: Observable<Settings>;

  cards: Card[];
  private subscriptions: Subscription[] = [];

  constructor() {
  }


  ngOnInit() {
    this.subscriptions.push(
      Observable
        .combineLatest(this.cards$, this.boardVisibilityPrefs$, this.settings$, this.user$)
        .subscribe(x => {
          let cards: Card[] = x[0];
          let visibilityPrefs: Object = x[1];
          const settings: Settings = x[2];
          const user: User = x[3];
          this.cards = cards.filter(
            card => moment(card.due).isBefore(moment().hours(0).minutes(0).seconds(0).milliseconds(0)) && !visibilityPrefs[card.idBoard] && !card.dueComplete && ( settings.observerMode ? true : card.idMembers.indexOf(user.id) > -1)
          );
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
