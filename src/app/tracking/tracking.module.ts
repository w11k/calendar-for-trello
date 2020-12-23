import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrackingService} from './tracking.service';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';

const cookieConfig: Partial<NgcCookieConsentConfig> = {
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
