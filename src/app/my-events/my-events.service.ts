import { HttpClient } from '@angular/common/http';
import { TrelloAuthService } from '../services/trello-auth.service';
import { Injectable } from '@angular/core';
const config = require('../../config.json');
import { Observable } from '../../../node_modules/rxjs/Observable';

@Injectable()
export class MyEventsService {

  constructor(
    private trelloAuthService: TrelloAuthService,
    private httpClient: HttpClient
  ) { }

  getCommentCards(id): Observable<any> {
    let token = this.trelloAuthService.getToken();
    return this.httpClient.get('https://api.trello.com/1/cards/' + id + '/actions?filter=commentCard' + '&token=' + token + '&key=' + config.apiKey);
  }
  
}
