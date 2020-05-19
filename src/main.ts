import {hmrBootstrap} from './hmr';

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {environment} from './environments/environment';
import 'hammerjs';
import {AppModule} from './app';

 const project = require('../package.json');

if (environment.production) {
  enableProdMode();
}



const bootstrap = () => {
  return platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
};

/*
export let IS_UPDATE = false;
const PROJECT_VERSION: string = project.version;

function check() {
  let token = localStorage.getItem('trello_token') || localStorage.getItem('token');

  if (!token) {
    // no token, fresh user
    return;
  }
  token = token.replace(/"/g, '');

  const dataVersion = localStorage.getItem('version');

  if (dataVersion !== PROJECT_VERSION) {
    // older v2 version

    // remove usage data (keeps settings!)
    localStorage.removeItem('w11k.trello-cal/members');
    localStorage.removeItem('w11k.trello-cal/boards');
    localStorage.removeItem('w11k.trello-cal/cards');

    IS_UPDATE = true;
    localStorage.setItem('version', PROJECT_VERSION);
  }

  if (!dataVersion) {
    // old v1 version, clear everything
    localStorage.clear();
    localStorage.setItem('token', token);
    localStorage.setItem('version', PROJECT_VERSION);
  }
}

check();
*/
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
