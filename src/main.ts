import './polyfills.ts';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {AppModule} from './app/';
const project = require('../package.json');

import {hmrBootstrap} from './hmr';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => {
  return platformBrowserDynamic().bootstrapModule(AppModule);
};


export let IS_UPDATE: boolean = false;
const PROJECT_VERSION: string = project.version;

function check() {
  let token = localStorage.getItem("trello_token") || localStorage.getItem("token");
  token = token.replace(/"/g, "");

  if (!token) {
    // no token, fresh user
    return;
  }

  let dataVersion = localStorage.getItem("version");

  if (dataVersion !== PROJECT_VERSION) {
    IS_UPDATE = true;
    localStorage.clear();
    localStorage.setItem("token", token);
    localStorage.setItem("version", PROJECT_VERSION);
  }

}

check();

if (environment.hmr) {
  if (module['hot']) {
    hmrBootstrap(module, bootstrap);
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
    console.log('Are you using the --hmr flag for ng serve?');
  }
} else {
  bootstrap();
}
