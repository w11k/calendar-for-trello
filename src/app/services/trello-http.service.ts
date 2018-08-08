import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class TrelloHttpService {


  constructor(public httpClient: HttpClient) {
  }

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.httpClient.get<T>(`https://api.trello.com/1/${url}`, {params});
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.httpClient.put<T>(`https://api.trello.com/1/${url}`, body);
  }

  post<T>(url: string, body?: Object): Observable<T> {
    return this.httpClient.post<T>(`https://api.trello.com/1/${url}`, body);
  }

  delete<T>(url: string, body?: Object): Observable<T> {
    return this.httpClient.delete<T>(`https://api.trello.com/1/${url}`, body);
  }

}

