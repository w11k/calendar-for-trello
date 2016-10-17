import {Injectable} from '@angular/core';
import {Http, Request, RequestOptionsArgs, Response, RequestMethod} from "@angular/http";
import {Observable} from "rxjs";
import {TrelloAuthService} from "./trello-auth.service";

const token = "f12d70979ef7864b882ce2a3ee3d6a4717e6450bd2b7b359ffa55571f19b8b49";


@Injectable()
export class TrelloHttpService {


  constructor(public http: Http, private trelloAuthService: TrelloAuthService) {
  }

  get(url: string, opts?: Request): Observable<Response> {
    let options: RequestOptionsArgs = {};
    options.method = RequestMethod.Get;
    if (opts) {
      Object.assign(options, opts)
    }
    return this._request(url, options)
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

  post(options: Request) {

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


  private _request(url: string, options: RequestOptionsArgs): Observable<Response> {
    let token = this.trelloAuthService.getToken();
    if (!token) {
      return Observable.throw('No Token Provided!');
    }
    options.url = "https://api.trello.com/1/" + url + "?key=80fe59b53fb09c24ee8cdf2c3303b608&token=" + token;
    return this.http.request(url, options)
  }
}

