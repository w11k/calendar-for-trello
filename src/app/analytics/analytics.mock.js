'use strict';

angular.module('w11kcal.analytics', [
    'angulartics',
    'angulartics.google.analytics'
]);

angular.module('w11kcal.analytics').config(function ($analyticsProvider) {
    $analyticsProvider.developerMode(true);
});
