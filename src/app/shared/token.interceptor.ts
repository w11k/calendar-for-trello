import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TrelloAuthService} from '../services/trello-auth.service';

const config = require('../../config.json');

@Injectable()
export class TokenInterceptor implements HttpInterceptor {


  constructor(private trelloAuthService: TrelloAuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let params = new HttpParams().append('token', this.trelloAuthService.getToken()).append('key', config.apiKey);

    // Copy old Params:
    request.params.keys().forEach(key => {
      params = params.set(key, request.params.get(key));
    });


    request = request.clone({
      params: params,
    });

    return next.handle(request);
  }
}
