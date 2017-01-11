import {Component, OnInit} from '@angular/core';
import {RootState, enhancers} from "./redux/store/index";
import {NgReduxRouter} from "ng2-redux-router";
const createLogger = require('redux-logger');
import reducer from '../app/redux/reducers/index';
import * as moment from "moment";
import {Router} from "@angular/router";
import {NgRedux, select} from "ng2-redux";
import {TrelloPullService} from "./services/trello-pull.service";
import {Settings} from "./models/settings";
import {Observable} from "rxjs";
import {TrelloAuthService} from "./services/trello-auth.service";
import {MenuItem} from "./models/menu-item";
import {environment} from "../environments/environment";
import {User} from "./models/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @select("settings") public settings$: Observable<Settings>;
  public settings: Settings = new Settings();

  private initStore: RootState = {
    cards: [],
    boards: [],
    user: null,
    calendar: {
      days: [],
      date: moment().locale("en")
    },
    settings: new Settings(),
    lists: {}
  };

  ngOnInit() {
    this.settings$.subscribe(
      settings => {
        this.settings = settings;
        moment.locale(settings.language);
      }
    )
  }

  constructor(private ngRedux: NgRedux<RootState>,
              private ngReduxRouter: NgReduxRouter,
              public router: Router,
              private trelloPullService: TrelloPullService,
              private trelloAuthService: TrelloAuthService) {

    const logger = environment.production ? [] : [createLogger()];

    this.ngRedux.configureStore(
      reducer,
      this.initStore,
      [], // logger
      enhancers
    );
    ngReduxRouter.initialize();
    this.trelloPullService.continuousFetch();

    this.settings$.subscribe(settings => this.settings = settings);
  }

  refresh() {
    this.trelloPullService.pull();
  }

  logout() {
    this.trelloAuthService.logout();
  }

  clearData() {
    this.ngRedux.dispatch({type: "RESET_BOARD_STORE"});
    this.ngRedux.dispatch({type: "RESET_USER_STORE"});
    this.ngRedux.dispatch({type: "RESET_CARD_STORE"});
    this.ngRedux.dispatch({type: "RESET_LIST_STORE"});
    this.ngRedux.dispatch({type: "REMOVE_BOARD_PREFERENCES"});
    setTimeout(() => {
      this.trelloPullService.pull();
    }, 500);
  }

  toIssue() {
    const win = window.open("https://github.com/w11k/calendar-for-trello/issues", '_blank');
    win.focus();
  }

}
