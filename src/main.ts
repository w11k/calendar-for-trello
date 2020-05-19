import {hmrBootstrap} from './hmr';

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {environment} from './environments/environment';
import 'hammerjs';
import {AppModule} from './app';


if (environment.production) {
  enableProdMode();
}


const bootstrap = () => {
  return platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
};


if (environment.hmr) {
  if (module['hot']) {
    hmrBootstrap(module, bootstrap as any);
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
    console.log('Are you using the --hmr flag for ng serve?');
  }
} else {
  bootstrap();
}

(window as any).cookieconsent.initialise({
  'palette': {
    'popup': {
      'background': '#3A476F'
    },
    'button': {
      'background': '#eb5a46',
      'text': '#fff'
    },
  },
  'content': {
    'href': 'https://calendar-for-trello.com/privacy',
    'message': 'This website uses cookies to ensure you get the best experience on our website.',
    'dismiss': 'Ok',
    'link': 'Learn more in our privacy policy',
  }
});
