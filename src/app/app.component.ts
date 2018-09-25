import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {enhancers, RootState} from './redux/store';
import {NgReduxRouter} from '@angular-redux/router';
import reducer from './redux/reducers';
import {NavigationEnd, Router} from '@angular/router';
import {NgRedux, select} from '@angular-redux/store';
import {TrelloPullService} from './services/trello-pull.service';
import {Settings} from './models/settings';
import {Observable, Subscription} from 'rxjs';
import {TrelloAuthService} from './services/trello-auth.service';
import {MatSnackBar} from '@angular/material';
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
    members: new Map(),
    router: {}
  };

  public isSidenavOpen = false;

  constructor(private ngRedux: NgRedux<RootState>,
              private ngReduxRouter: NgReduxRouter,
              public router: Router,
              private trelloPullService: TrelloPullService,
              private trelloAuthService: TrelloAuthService,
              private snackBar: MatSnackBar) {

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
      this.settings$.subscribe(settings => this.settings = settings)
    );

    if (this.settings.weekViewShowHours === undefined) {
      this.settings.weekViewShowHours = true;
    }
    if (this.settings.showWeekend === undefined) {
      this.settings.showWeekend = true;
    }
    if (this.settings.businessHoursStart === undefined) {
      this.settings.businessHoursStart = 9;
    }
    if (this.settings.businessHoursEnd === undefined) {
      this.settings.businessHoursEnd = 18;
    }

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

  trigger() {

    const myform = document.createElement('form');
    myform.action = 'https://www.paypal.com/cgi-bin/webscr';
    myform.method = 'post';
    myform.target = '_blank';
    myform.className = 'hidden';

    const cmd = document.createElement('input');
    cmd.name = 'cmd';
    cmd.type = 'hidden';
    cmd.value = '_s-xclick';

    const hosted = document.createElement('input');
    hosted.name = 'hosted_button_id';
    hosted.type = 'hidden';
    hosted.value = 'E2NMK8X28A7PC';

    myform.appendChild(cmd);
    myform.appendChild(hosted);
    document.body.appendChild(myform); // Not sure if this step is necessary

    myform.submit();

    // cleanup
    setTimeout(() => {
      myform.remove();
    }, 500);

  }

}
