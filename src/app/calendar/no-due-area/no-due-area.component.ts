import {Component, OnInit} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {Card} from "../../models/card";
import {select} from "ng2-redux";
import {selectBoardColorPrefs} from "../../redux/store/selects";
import {Settings} from "../../models/settings";
import {User} from "../../models/user";

@Component({
  selector: 'app-no-due-area',
  templateUrl: './no-due-area.component.html',
  styleUrls: ['./no-due-area.component.scss']
})
export class NoDueAreaComponent implements OnInit {

  constructor() {
  }

  @select(selectBoardColorPrefs) public boardVisibilityPrefs$: Observable<Object>;
  @select("cards") public cards$: Observable<Card[]>;
  @select("user") public user$: Observable<User>;
  @select("settings") public settings$: Observable<Settings>;

  private subscriptions: Subscription[] = [];
  public cards: Card[];

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
            card => !card.due && !visibilityPrefs[card.idBoard] && ( settings.observerMode ? true : card.idMembers.indexOf(user.id) > -1)
          );
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
