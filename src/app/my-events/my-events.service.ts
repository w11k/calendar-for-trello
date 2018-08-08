import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

@Injectable()
export class MyEventsService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getCommentCards(id): Observable<any> {
    return this.httpClient.get('https://api.trello.com/1/cards/' + id + '/actions?filter=commentCard').retry(5);
  }

  getCardsByUser(user: string) {
    const cardsUrl = 'https://api.trello.com/1/search?query=comment%3A%22%40' + user;
    return this.httpClient.get(cardsUrl);
  }

}
