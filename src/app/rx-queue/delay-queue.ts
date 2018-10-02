import {concat, empty, of, Subject, Subscription} from 'rxjs';
import {concatMap, delay} from 'rxjs/operators';

import RxQueue from './rx-queue';

/**
 * DelayQueue passes all the items and add delays between items.
 * T: item type
 */
export class DelayQueue<T = any> extends RxQueue<T> {
  private subscription: Subscription;
  private subject: Subject<T>;

  /**
   *
   * @param period milliseconds
   */
  constructor(
    period?: number, // milliseconds
  ) {
    super(period);

    this.subject = new Subject<T>();
    this.subscription = this.subject.pipe(
      concatMap(args => concat(
        of(args),                           // emit first item right away
        empty().pipe(delay(this.period)),   // delay next item
      )),
    ).subscribe((item: T) => super.next(item));
  }

  public next(item: T) {
    this.subject.next(item);
  }

  public unsubscribe() {
    this.subscription.unsubscribe();
    super.unsubscribe();
  }
}

export default DelayQueue;
