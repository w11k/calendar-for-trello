import {Component, OnInit, HostListener, OnDestroy} from '@angular/core';
import {RootState, enhancers} from './redux/store/index';
import {NgReduxRouter} from '@angular-redux/router';
import reducer from '../app/redux/reducers/index';
import * as moment from 'moment';
import {Router, NavigationEnd} from '@angular/router';
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
    members: {},
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
      this.settings$.subscribe(
        settings => {
          this.settings = settings;
          // moment.locale(settings.language);
        }
      )
    );

    this.subscriptions.push(
      this.settings$.subscribe(settings => this.settings = settings)
    );

    if (this.settings.weekViewShowHours === undefined) {
      this.settings.weekViewShowHours = true;
    }
    if (this.settings.weekDays === undefined) {
      this.settings.weekDays = 5;
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

    let myform = document.createElement('form');
    myform.action = 'https://www.paypal.com/cgi-bin/webscr';
    myform.method = 'post';
    myform.target = '_blank';
    myform.className = 'hidden';

    let cmat = document.createElement('input');
    cmat.name = 'cmat';
    cmat.type = 'hidden';
    cmat.value = '_donations';

    let encrypted = document.createElement('input');
    encrypted.type = 'hidden';
    encrypted.name = 'business';
    encrypted.value = 'payments@w11k.de';

    let lc = document.createElement('input');
    lc.type = 'hidden';
    lc.name = 'lc';
    lc.value = 'GB';

    let itemname = document.createElement('input');
    itemname.type = 'hidden';
    itemname.name = 'item_name';
    itemname.value = 'Trello Calendar - W11K GmbH';

    let itemnumber = document.createElement('input');
    itemnumber.type = 'hidden';
    itemnumber.name = 'item_number';
    itemnumber.value = '2013';

    let note = document.createElement('input');
    note.type = 'hidden';
    note.name = 'no_note';
    note.value = '0';

    let currency = document.createElement('input');
    currency.type = 'hidden';
    currency.name = 'currency_code';
    currency.value = 'USD';

    let bn = document.createElement('input');
    bn.type = 'hidden';
    bn.name = 'bn';
    bn.value = 'PP-DonationsBF:btn_donate_LG.gif:NonHostedGuest';

    let image = document.createElement('input');
    image.type = 'image';
    image.src = 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif';
    image.border = '0';
    image.id = 'Dimage';
    image.name = 'submit';
    image.alt = 'PayPal - The safer, easier way to pay online!';

    //Most probably this can be skipped, but I left it in here since it was present in the generated code
    let pixel: any = document.createElement('image');
    pixel.border = '0';
    pixel.alt = '';
    pixel.src = 'https://www.paypalobjects.com/en_US/i/scr/pixel.gif';
    pixel.width = '1';
    pixel.height = '1';

    myform.appendChild(cmat);
    myform.appendChild(encrypted);
    myform.appendChild(lc);
    myform.appendChild(itemname);
    myform.appendChild(note);
    myform.appendChild(currency);
    myform.appendChild(bn);
    myform.appendChild(image);
    myform.appendChild(pixel);
    document.body.appendChild(myform); // Not sure if this step is necessary

    myform.submit();

    // cleanup
    setTimeout(() => {
      myform.remove();
    }, 500);

  }

}
