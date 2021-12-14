import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import { NgcCookieConsentService, NgcStatusChangeEvent } from 'ngx-cookieconsent';
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

  gaProperty = 'UA-61728009-5';  //this is the tracking ID
  disableStr = 'ga-disable-' + this.gaProperty;
  flagsValue = 'sameSite=Strict';

  public init() {
    this.ngcCookieContentService.statusChange$.subscribe(
        (event: NgcStatusChangeEvent) => {
          console.log('this is the event of status_changed: ' , event);
          if(event.status === "dismiss") {
            this.enableGoogleAnalyticsWithoutCookies(this.gaProperty);
          }
        });

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


  //this is the main function
  private enableGoogleAnalyticsWithoutCookies = function (trackingID) {
    console.log('____enableGoogleAnalyticsWithoutCookies is called____')

    this.fetchClientUrl('https://www.cloudflare.com/cdn-cgi/trace').then(data => {
      const clientIP = data.split("\n").filter(el => el.startsWith("ip")).join('\n').replace('ip=', '');
      let validityInterval = Math.round((new Date().getTime()) / 1000 / 3600 / 24 / 4);
      let clientIDSource = clientIP + ";" + window.location.host + ";" + navigator.userAgent + ";" + navigator.language + ";" +
          validityInterval;
      let clientIDHashed = this.cyrb53(clientIDSource).toString(16);

      /*
      https://helgeklein.com/blog/2020/06/google-analytics-cookieless-tracking-without-gdpr-consent/
      only works with Universal Analytics property (The Universal Analytics property is a part of an earlier version
      of Google Analytics and only supports web measurement. It isn't recommended for new Analytics users,
      and it won't support app measurement. Turn this on if you'd like to create a Universal Analytics property.)
      */
      (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
          (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * (new Date().getTime());
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
      })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
      ga('create', trackingID, {
        'storage': 'none',
        'clientId': clientIDHashed
      });
      ga('set', 'anonymizeIp', true);
      ga('send', 'pageview');

      console.log('Google Analytics enabled (WITHOUT cookies)');

    })
        .catch(e => {
          console.log('Google Analytics not enabled (WITHOUT cookies) because of', e)
        });
  };


  private cyrb53 = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
    h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };

  private fetchClientUrl = function (url) {
    return fetch(url).then(res => res.text());
  };


} //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
