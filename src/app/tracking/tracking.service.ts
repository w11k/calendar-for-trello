import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {NgcCookieConsentService} from 'ngx-cookieconsent';
import {TrackingEvent} from './tracking-event.model';


declare const ga: Function;

interface WindowWithDataLayer extends Window {
  dataLayer: Array<any>;
}

/**
 * This Service is shared across multiple lazy loaded modules and
 * is therefore provided via forRoot! */
@Injectable()
export class TrackingService {

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private readonly ngcCookieContentService: NgcCookieConsentService) {
  }

  gaProperty = 'UA-61728009-5';
  disableStr = 'ga-disable-' + this.gaProperty;
  flagsValue = 'sameSite=Strict';

  public init() {
    console.log('inside tracking service : init is called');

    if (isPlatformBrowser(this.platformId)) {
      console.log('inside tracking service : init is called: inside first if');
      console.log('this is platform is : ' , this.platformId);

      console.log('this is document cookie : ', document.cookie);
      if (document.cookie.includes('cookieconsent_status=allow')) {
        this.enableGoogleTracking(this.gaProperty);
      }

      this.ngcCookieContentService.statusChange$
        .subscribe(status => {
          if (status.status === 'allow') {
            this.enableGoogleTracking(this.gaProperty);
          }
        });
    }
  }

  public track(event: TrackingEvent) {
    console.log('inside tracking service : track is called()');

    if (isPlatformBrowser(this.platformId)) {
      ga('send', 'event', event.category, event.action, event.label, event.value);
    }
  }

  private enableGoogleTracking(gaProperty) {
    console.log('inside tracking service : enableGoogleTracking is called');
    console.log('this is document cookie : ', document.cookie);

    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments);
      }, i[r].l = 1 * new Date().getTime();
      a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    ga('create', this.gaProperty, 'auto', {cookieFlags: this.flagsValue});
    ga('set', 'anonymizeIp', true);

    console.log('this is document cookie : ', document.cookie);
  }


}
