import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs';
import DelayQueue from '../rx-queue/delay-queue';


export interface IntermediateObject {
  request: HttpRequest<any>;
  next: HttpHandler;
  sub: Subject<any>;
}

@Injectable()
export class QueueInterceptor implements HttpInterceptor {

  delay: DelayQueue<IntermediateObject> = new DelayQueue(300);

  constructor() {

    this.delay.subscribe(inter => {
      inter.next.handle(inter.request)
        .subscribe(reqResponse => {
          inter.sub.next(reqResponse);
        }, err => {
          inter.sub.error(err);
        }, () => {
          inter.sub.complete();
        });
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sub = new Subject<HttpEvent<any>>();

    this.delay.next({
      request,
      next,
      sub
    });

    return sub.asObservable();
  }
}
