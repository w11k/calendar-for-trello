import DelayQueue from './delay-queue';
import {Subscription} from 'rxjs';

export interface ExecutionUnit<T = any> {
  fn: () => T;
  name: string;
  resolve: (value?: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

/**
 * DelayQueueExector calls functions one by one with a delay time period between calls.
 */
export class DelayQueueExector<T = any> extends DelayQueue<ExecutionUnit<T>> {
  private readonly delayQueueSubscription: Subscription;

  /**
   *
   * @param period milliseconds
   */
  constructor(
    period: number,
  ) {
    super(period);

    this.delayQueueSubscription = this.subscribe(unit => {
      try {
        const ret = unit.fn();
        return unit.resolve(ret);
      } catch (e) {
        return unit.reject(e);
      }
    });
  }

  public async execute(
    fn: () => T,
    name?: string,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const unit: ExecutionUnit<T> = {
        fn,
        name: name || fn.name,
        resolve,
        reject,
      };
      this.next(unit);
    });
  }

  public unsubscribe() {
    this.delayQueueSubscription.unsubscribe();
    super.unsubscribe();
  }
}

export default DelayQueueExector;
