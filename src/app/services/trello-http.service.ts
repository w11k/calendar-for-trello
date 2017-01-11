import {Injectable} from '@angular/core';
import {Http, Request, RequestOptionsArgs, Response, RequestMethod} from "@angular/http";
import {Observable} from "rxjs";
import {TrelloAuthService} from "./trello-auth.service";


@Injectable()
export class TrelloHttpService {


  constructor(public http: Http, private trelloAuthService: TrelloAuthService) {
  }

  get(url: string, opts?: Request, params?: string): Observable<Response> {
    let options: RequestOptionsArgs = {};
    options.method = RequestMethod.Get;
    if (opts) {
      Object.assign(options, opts)
    }
    return this._request(url, options, params)
  }

  put(url: string, body: Object, opts?: RequestOptionsArgs): Observable<Response> {
    let options: RequestOptionsArgs = {};
    options.method = RequestMethod.Put;
    if (opts) {
      Object.assign(options, opts)
    }
    options.body = body;
    return this._request(url, options)
  }

  post(url: string, body?: Object, opts?: RequestOptionsArgs): Observable<Response> {
    let options: RequestOptionsArgs = {};
    options.method = RequestMethod.Post;
    if (opts) {
      Object.assign(options, opts)
    }
    options.body = body;
    return this._request(url, options)
  }

  delete(url: string, body?: Object, opts?: RequestOptionsArgs): Observable<Response> {
    let options: RequestOptionsArgs = {};
    options.method = RequestMethod.Delete;
    if (opts) {
      Object.assign(options, opts)
    }
    options.body = body;
    return this._request(url, options)

  }


  private _request(url: string, options: RequestOptionsArgs, params?: string): Observable<Response> {
    let token = this.trelloAuthService.getToken();
    if (!token) {
      return Observable.throw('No Token Provided!');
    }
    options.url = "https://api.trello.com/1/" + url + "?key=41485cd87d154168dd6db06cdd3ffd69&token=" + token + (params ? "&" + params : "");
    return this.http.request(url, options)
  }
}

