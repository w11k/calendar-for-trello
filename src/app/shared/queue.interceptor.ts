import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import DelayQueue from '../rx-queue/delay-queue';
import {LoadingSpinnerService} from '../loading-spinner/loading-spinner.service';


export interface IntermediateObject {
  request: HttpRequest<any>;
  next: HttpHandler;
  sub: Subject<any>;
}

@Injectable()
export class QueueInterceptor implements HttpInterceptor {

  delay: DelayQueue<IntermediateObject> = new DelayQueue(300);

  constructor(private loadingSpinnerService: LoadingSpinnerService) {

    this.delay.subscribe(inter => {
      inter.next.handle(inter.request)
        .subscribe(reqResponse => {
          inter.sub.next(reqResponse);
        }, err => {
          inter.sub.error(err);
        }, () => {
          this.loadingSpinnerService.decrease();
          inter.sub.complete();
        });
    });
  }

  // Maybe dont queue put / post?
  // For instant updates..
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sub = new Subject<HttpEvent<any>>();
    this.loadingSpinnerService.increase();
    this.delay.next({
      request,
      next,
      sub
    });

    return sub.asObservable();
  }
}
