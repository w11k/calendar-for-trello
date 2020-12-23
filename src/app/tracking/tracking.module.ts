import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrackingService} from './tracking.service';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';
import {environment} from '../../environments/environment';

const cookieConfig: Partial<NgcCookieConsentConfig> = {
  // 'palette': {
  //   'popup': {
  //     'background': '#ee5d26',
  //     'text': '#ffffff',
  //   },
  //   'button': {
  //     'background': '#33438d',
  //     'text': '#ffffff',
  //   },
  // },
  // cookie: {
  //   domain: environment.cookieDomain
  // },
  // 'position': 'bottom',
  // 'type': 'opt-in',
  // 'content': {
  //   'message': 'Beim Besuch unserer Website können Cookies (Webtracking) eingesetzt werden. Es sind keine Rückschlüsse auf Ihre Person möglich, die Daten sind anonymisiert. Bitte helfen Sie uns, unsere Website auch in Zukunft benutzerfreundlich gestalten zu können. Die Einwilligung kann jederzeit widerrufen werden.',
  //   'deny': 'Ich stimme nicht zu',
  //   'dismiss': 'Ich stimme nicht zu',
  //   'allow': 'Ich bin einverstanden',
  //   'link': 'Mehr erfahren',
  //   'href': '/legal/datenschutz',
  // },

  'palette': {
    'popup': {
      'background': '#3A476F'
    },
    'button': {
      'background': '#eb5a46',
      'text': '#fff'
    },
  },
  'position': 'bottom',
  'type': 'opt-in',
  'content': {
    'href': 'https://calendar-for-trello.com/en/privacy',
    'message': 'This website uses cookies to ensure you get the best experience on our website.',
    'deny': 'Deny',
    'dismiss': 'Deny',
    'allow': 'Ok',
    'link': 'Learn more in our privacy policy',
  }
};

@NgModule({
  imports: [
    CommonModule,
    NgcCookieConsentModule.forRoot(cookieConfig as NgcCookieConsentConfig),
  ],
  declarations: [],
})

export class TrackingModule {

  static forRoot() {
    return {
      ngModule: TrackingModule,
      providers: [TrackingService]
    };
  }


}
