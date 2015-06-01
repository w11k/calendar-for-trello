// mock
'use strict';

angular.module('trelloCal.analytics', [
    'angulartics',
    'angulartics.google.analytics'
]);

angular.module('trelloCal.analytics').config(function ($analyticsProvider) {
    $analyticsProvider.developerMode(false);
});