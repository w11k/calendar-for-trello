import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class DropZoneService {

  public channel: Subject<boolean> = new Subject();

  constructor() {
  }

  public getUpdates() {
    return this.channel.asObservable();
  }

  public dragStart() {
    this.channel.next(true);
  }

  public dragStop() {
    this.channel.next(false);
  }
}
