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


