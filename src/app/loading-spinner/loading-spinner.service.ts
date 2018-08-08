import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {

  private counter$ = new BehaviorSubject(0);

  constructor() {
  }

  get loading(): Observable<boolean> {
    return this.counter$.pipe(map(val => val !== 0));
  }

  increase() {
    this.counter$.next(this.counter$.value + 1);
  }

  decrease() {
    this.counter$.next(this.counter$.value - 1);
  }
}
