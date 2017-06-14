import {Component, OnInit, HostListener, OnDestroy} from '@angular/core';
import {RootState, enhancers} from './redux/store/index';
import {NgReduxRouter} from 'ng2-redux-router';
import reducer from '../app/redux/reducers/index';
import * as moment from 'moment';
import {Router, NavigationEnd} from '@angular/router';
import {NgRedux, select} from 'ng2-redux';
import {TrelloPullService} from './services/trello-pull.service';
import {Settings} from './models/settings';
import {Observable, Subscription} from 'rxjs';
import {TrelloAuthService} from './services/trello-auth.service';
import {MdSnackBar} from '@angular/material';
import {IS_UPDATE} from '../main';
import {SettingsActions} from './redux/actions/settings-actions';
import {ListActions} from './redux/actions/list-actions';
import {CardActions} from './redux/actions/card-actions';
import {UserActions} from './redux/actions/user-actions';
import {BoardActions} from './redux/actions/board-actions';
const project = require('../../package.json');
declare let ga: Function;

// declare const IS_UPDATE:boolean;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @select('settings') public settings$: Observable<Settings>;

  public settings: Settings = new Settings();
  private subscriptions: Subscription[] = [];
  private initStore: RootState = {
    cards: [],
    boards: [],
    user: null,
    calendar: {
      days: [],
      date: null
    },
    settings: new Settings(),
    lists: {},
    members: {}
  };

  public isSidenavOpen = false;

  constructor(private ngRedux: NgRedux<RootState>,
              private ngReduxRouter: NgReduxRouter,
              public router: Router,
              private trelloPullService: TrelloPullService,
              private trelloAuthService: TrelloAuthService,
              private snackBar: MdSnackBar) {

    if (IS_UPDATE) {
      this.snackBar.open('Calendar for Trello was updated to version ' + project.version + '!', 'OK');
    }

    ga('send', 'event', 'version', project.version);

    this.subscriptions.push(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        }
      })
    );

    this.ngRedux.configureStore(
      reducer,
      this.initStore,
      [],
      enhancers
    );
    ngReduxRouter.initialize();

  }

  ngOnInit() {
    this.subscriptions.push(
      this.settings$.subscribe(
        settings => {
          this.settings = settings;
          moment.locale(settings.language);
        }
      )
    );

    this.subscriptions.push(
      this.settings$.subscribe(settings => this.settings = settings)
    );

    this.checkWidth(window.innerWidth);
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkWidth(event.target.innerWidth);
  }

  checkWidth(width) {
    this.isSidenavOpen = width > 1499;
  }


  logout() {
    this.trelloAuthService.logout();
  }

  clearData() {
    this.ngRedux.dispatch({type: BoardActions.RESET_BOARD_STORE});
    this.ngRedux.dispatch({type: UserActions.RESET_USER_STORE});
    this.ngRedux.dispatch({type: CardActions.RESET_CARD_STORE});
    this.ngRedux.dispatch({type: ListActions.RESET_LIST_STORE});
    this.ngRedux.dispatch({type: SettingsActions.RESET_SETTINGS_STORE});
    setTimeout(() => {
      this.trelloPullService.pull();
    }, 500);
  }

  toIssue() {
    const win = window.open('https://github.com/w11k/calendar-for-trello/issues', '_blank');
    win.focus();
  }

}
