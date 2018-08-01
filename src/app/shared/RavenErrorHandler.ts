import * as Raven from 'raven-js';
import {ErrorHandler} from '@angular/core';
const project = require('../../../package.json');
const options = {release: project.version, autoBreadcrumbs: {'xhr': false}};
// Raven.config('http://fa6a3d4a6b6f42cf8b66807942105932@sentry.w11k.de/2', options).install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    // Log to the console.
    try {
      console.group('ErrorHandler');
      console.error(err.message);
      console.error(err.stack);
      console.groupEnd();
    } catch (handlingError) {
      console.group('ErrorHandler');
      console.warn('Error when trying to output error.');
      console.error(handlingError);
      console.groupEnd();
    }
    Raven.captureException(err.originalError);
  }
}
