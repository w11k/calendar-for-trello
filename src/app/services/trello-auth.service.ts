import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BoardActions} from '../redux/actions/board-actions';
import {UserActions} from '../redux/actions/user-actions';
import {CardActions} from '../redux/actions/card-actions';
import {RootState} from '../redux/store';
import {NgRedux} from '@angular-redux/store';
const config = require('../../config.json');

@Injectable()
export class TrelloAuthService {

  public token: string;

  constructor(private router: Router, private ngRedux: NgRedux<RootState>) {
    this.token = localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  login() {
    const href = window.location.href + '/setToken';
    window.location.href = 'https://trello.com/1/authorize?response_type=token&key=' + config.apiKey + '&return_url=' +
      encodeURI(href) +
      '&callback_method=fragment&scope=read%2Cwrite%2Caccount&expiration=never&name=Calendar+for+Trello';
  }

  logout() {
    this.ngRedux.dispatch({type: 'RESET_BOARD_STORE'});
    this.ngRedux.dispatch({type: 'RESET_USER_STORE'});
    this.ngRedux.dispatch({type: 'RESET_CARD_STORE'});
    this.ngRedux.dispatch({type: 'RESET_LIST_STORE'});
    this.ngRedux.dispatch({type: 'REMOVE_BOARD_PREFERENCES'});
    localStorage.removeItem('token');
    this.router.navigate(['/start']);
  }
}
