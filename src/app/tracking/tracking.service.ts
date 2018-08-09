import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {TrackingEvent} from './tracking-event.model';


declare const ga: Function;


/**
 * This Service is shared across multiple lazy loaded modules and
 * is therefore provided via forRoot! */
@Injectable()
export class TrackingService {


  constructor(@Inject(PLATFORM_ID) private platformId: string) {
  }

  track(event: TrackingEvent) {
    ga('send', 'event', event.category, event.action, event.label, event.value);
  }

}
