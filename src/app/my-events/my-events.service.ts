import { HttpClient } from '@angular/common/http';
import { TrelloAuthService } from '../services/trello-auth.service';
import { Injectable } from '@angular/core';
const config = require('../../config.json');
import { Observable } from '../../../node_modules/rxjs/Observable';
import 'rxjs/add/operator/retry';

@Injectable()
export class MyEventsService {

  constructor(
    private trelloAuthService: TrelloAuthService,
    private httpClient: HttpClient
  ) { }

  getCommentCards(id): Observable<any> {
    let token = this.trelloAuthService.getToken();
    return this.httpClient.get('https://api.trello.com/1/cards/' + id + '/actions?filter=commentCard' + '&token=' + token + '&key=' + config.apiKey).retry(5);
  }

  getCardsByUser(user: string) {
    let token = this.trelloAuthService.getToken();
    let stuff = 'https://api.trello.com/1/search?query=comment%3A%22%40' + user + '&token=' + token + '&key=' + config.apiKey;
    return this.httpClient.get(stuff);
  }

}
