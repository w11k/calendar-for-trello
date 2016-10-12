import {Injectable} from '@angular/core';

@Injectable()
export class TrelloAuthService {

  // todo remove this:
  public token: string;

  constructor() {
    // todo remove this:
    this.token = localStorage.getItem("token");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  login() {
    const key = "80fe59b53fb09c24ee8cdf2c3303b608";
    const href = window.location.href + "/setToken";
    window.location.href = 'https://trello.com/1/authorize?response_type=token&key=' + key + '&return_url=' + encodeURI(href) + '&callback_method=fragment&scope=read%2Cwrite%2Caccount&expiration=never&name=Calendar+for+Trello';
  }
}
