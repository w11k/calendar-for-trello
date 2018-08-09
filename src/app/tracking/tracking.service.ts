import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {TrackingEvent} from './tracking-event.model';

interface WindowWithDataLayer extends Window {
  dataLayer: Array<any>;
}


/**
 * This Service is shared across multiple lazy loaded modules and
 * is therefore provided via forRoot! */
@Injectable()
export class TrackingService {


  constructor(@Inject(PLATFORM_ID) private platformId: string) {
  }

  track(event: TrackingEvent) {
    if (isPlatformBrowser(this.platformId)) {
      (window as WindowWithDataLayer).dataLayer.push(event);

    }
  }

}
